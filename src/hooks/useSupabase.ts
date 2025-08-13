import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];
type Views = Database['public']['Views'];

// ✅ HOOK CORREGIDO: Gestionar proveedores con BD real
export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Tables['suppliers']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proveedores')
        .select(`
          *,
          proveedor_cuentas_bancarias (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      // ✅ INSERTAR EN TABLA REAL: proveedores
      const { data: supplier, error: supplierError } = await supabase
        .from('proveedores')
        .insert({
          ruc: supplierData.ruc,
          razon_social: supplierData.businessName,
          nombre_comercial: supplierData.tradeName || null,
          tipo_persona: supplierData.personType,
          pais: supplierData.country,
          direccion: supplierData.address,
          tipo_comprobante_a_emitir: supplierData.documentType,
          ficha_ruc_url: supplierData.rucFileUrl || null,
          persona_contacto: supplierData.contactPerson || null,
          email_contacto: supplierData.contactEmail || '',
          telefono_contacto: supplierData.contactPhone || null,
          correo_neo_solicitante: supplierData.neoContactEmail || null
        })
        .select();

      if (supplierError) throw supplierError;

      // ✅ INSERTAR EN TABLA REAL: proveedor_cuentas_bancarias
      const bankAccounts = [];
      
      // Cuenta 1 (Soles)
      if (supplierData.bankName1 && supplierData.accountNumber1) {
        bankAccounts.push({
          proveedor_id: supplier[0].id,
          banco: supplierData.bankName1,
          numero_cuenta: supplierData.accountNumber1,
          tipo_cuenta: supplierData.accountType1 || 'corriente',
          moneda: 'PEN' as const,
          cci: supplierData.cci1 || null,
          es_principal: true
        });
      }
      
      // Cuenta 2 (Dólares)
      if (supplierData.bankName2 && supplierData.accountNumber2) {
        bankAccounts.push({
          proveedor_id: supplier[0].id,
          banco: supplierData.bankName2,
          numero_cuenta: supplierData.accountNumber2,
          tipo_cuenta: supplierData.accountType2 || 'corriente',
          moneda: 'USD' as const,
          cci: supplierData.cci2 || null,
          es_principal: false
        });
      }

      // Insertar cuentas bancarias
      if (bankAccounts.length > 0) {
        const { error: bankError } = await supabase
          .from('proveedor_cuentas_bancarias')
          .insert(bankAccounts);

        if (bankError) throw bankError;
      }

      await fetchSuppliers(); // Refresh list
      return supplier[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating supplier');
      throw err;
    }
  };

  const updateSupplier = async (id: string, updates: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('proveedores')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchSuppliers(); // Refresh list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating supplier');
      throw err;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier
  };
};

// ✅ HOOK CORREGIDO: Gestionar documentos/facturas con BD real
export const useDocuments = () => {
  const [documents, setDocuments] = useState<Tables['invoices']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comprobantes')
        .select(`
          *,
          proveedores (razon_social, ruc)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      // ✅ INSERTAR EN TABLA REAL: comprobantes
      const { data: document, error: docError } = await supabase
        .from('comprobantes')
        .insert({
          proveedor_id: documentData.supplierId,
          tipo_documento: documentData.type,
          numero_documento: documentData.number,
          monto: documentData.amount,
          moneda: documentData.currency,
          tiene_detraccion: documentData.hasDetraction || false,
          aprobador_email: documentData.approverEmail,
          servicio_realizado: documentData.servicePerformed || null,
          comprobante_pdf_url: documentData.fileUrl || null,
          status: 'pendiente'
        })
        .select();

      if (docError) throw docError;

      // ✅ INSERTAR EN TABLA REAL: pagos (automático por trigger o manual)
      const { error: paymentError } = await supabase
        .from('pagos')
        .insert({
          comprobante_id: document[0].id,
          monto: documentData.amount,
          moneda: documentData.currency,
          estado_pago: 'pendiente'
        });

      if (paymentError) throw paymentError;

      await fetchDocuments(); // Refresh list
      return document[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating document');
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('comprobantes')
        .update({
          status: updates.status,
          motivo_rechazo: updates.rejection_reason
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchDocuments(); // Refresh list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating document');
      throw err;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument
  };
};

// ✅ HOOK CORREGIDO: Gestionar pagos con BD real
export const usePayments = () => {
  const [payments, setPayments] = useState<Tables['payments']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pagos')
        .select(`
          *,
          comprobantes (
            numero_documento,
            tipo_documento,
            proveedores (razon_social, ruc)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, updates: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('pagos')
        .update({
          estado_pago: updates.paymentStatus,
          metodo_pago: updates.paymentMethod,
          fecha_estimada_pago: updates.estimatedPaymentDate,
          fecha_pago: updates.actualPaymentDate,
          cuenta_bancaria_id: updates.bankAccountId,
          notas: updates.notes
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchPayments(); // Refresh list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating payment');
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    updatePayment
  };
};

// ✅ HOOK CORREGIDO: Gestionar comunicados con BD real
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Tables['announcements']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (announcementData: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('comunicados')
        .insert({
          titulo: announcementData.title,
          contenido: announcementData.content,
          tipo: announcementData.type || 'general',
          urgente: announcementData.isUrgent || false,
          audiencia: announcementData.targetRole === 'all' ? 'todos' : 'proveedores',
          proveedor_id: announcementData.targetSupplier || null,
          created_by_user: announcementData.createdBy
        })
        .select();

      if (error) throw error;
      
      await fetchAnnouncements(); // Refresh list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating announcement');
      throw err;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement
  };
};

// ✅ HOOK CORREGIDO: Gestionar documentos de empresa con BD real
export const useCompanyDocuments = () => {
  const [companyDocuments, setCompanyDocuments] = useState<Tables['operations_documents']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyDocuments = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documentos_operaciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanyDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching company documents');
    } finally {
      setLoading(false);
    }
  };

  const createCompanyDocument = async (documentData: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('documentos_operaciones')
        .insert({
          titulo: documentData.name,
          tipo: documentData.type,
          descripcion: documentData.description,
          archivo_url: documentData.fileUrl,
          audiencia: documentData.supplierId ? 'proveedor_especifico' : 'todos',
          proveedor_id: documentData.supplierId || null,
          created_by_user: documentData.uploadedBy
        })
        .select();

      if (error) throw error;
      
      await fetchCompanyDocuments(); // Refresh list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating company document');
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanyDocuments();
  }, []);

  return {
    companyDocuments,
    loading,
    error,
    fetchCompanyDocuments,
    createCompanyDocument
  };
};

// ✅ HOOK CORREGIDO: Gestionar feedback con BD real
export const useFeedbackSurveys = () => {
  const [feedbackSurveys, setFeedbackSurveys] = useState<Tables['supplier_feedback']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackSurveys = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('encuestas_feedback')
        .select(`
          *,
          proveedores (razon_social, ruc)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbackSurveys(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching feedback surveys');
    } finally {
      setLoading(false);
    }
  };

  const createFeedbackSurvey = async (surveyData: any) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    try {
      const { data, error } = await supabase
        .from('encuestas_feedback')
        .insert({
          proveedor_id: surveyData.supplierId,
          comunicacion: surveyData.communication,
          puntualidad_pagos: surveyData.paymentTiming,
          facilidad_portal: surveyData.platformUsability,
          satisfaccion_general: surveyData.overallSatisfaction,
          comentarios: surveyData.comments,
          sugerencias: surveyData.suggestions
        })
        .select();

      if (error) throw error;
      
      await fetchFeedbackSurveys(); // Refresh list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating feedback survey');
      throw err;
    }
  };

  useEffect(() => {
    fetchFeedbackSurveys();
  }, []);

  return {
    feedbackSurveys,
    loading,
    error,
    fetchFeedbackSurveys,
    createFeedbackSurvey
  };
};

// ✅ HOOK NUEVO: Gestionar usuarios de operaciones
export const useOperationsUsers = () => {
  const [operationsUsers, setOperationsUsers] = useState<Tables['operations_users']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOperationsUsers = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('activo', true)
        .eq('perfil', 'operaciones')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperationsUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching operations users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsUsers();
  }, []);

  return {
    operationsUsers,
    loading,
    error,
    fetchOperationsUsers
  };
};

// ✅ HOOK NUEVO: Gestionar directorio de aprobadores
export const useApprovers = () => {
  const [approvers, setApprovers] = useState<Tables['approver_directory']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovers = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('activo', true)
        .eq('perfil', 'aprobador')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching approvers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovers();
  }, []);

  return {
    approvers,
    loading,
    error,
    fetchApprovers
  };
};

// ✅ HOOK NUEVO: Dashboard stats usando vistas reales
export const useDashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplierStats = async (supplierId: string) => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // ✅ USAR SUPABASE CLIENT: v_dashboard_proveedor con proveedor_id
      const { data, error } = await supabase
        .from('v_dashboard_proveedor')
        .select('*')
        .eq('proveedor_id', supplierId)
        .maybeSingle();

      if (error) throw error;
      setStats(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching supplier stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperationsStats = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // ✅ USAR SUPABASE CLIENT: v_dashboard_operaciones
      const { data, error } = await supabase
        .from('v_dashboard_operaciones')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setStats(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching operations stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchApproverInbox = async (approverEmail: string) => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // ✅ USAR SUPABASE CLIENT: v_aprobador_inbox con aprobador_email
      const { data, error } = await supabase
        .from('v_aprobador_inbox')
        .select('*')
        .eq('aprobador_email', approverEmail)
        .eq('status', 'pendiente');

      if (error) throw error;
      setStats({ pendingDocuments: data?.length || 0, documents: data || [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching approver inbox');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchSupplierStats,
    fetchOperationsStats,
    fetchApproverInbox
  };
};

// ✅ HOOK NUEVO: Cola de pagos para operaciones
export const usePaymentsQueue = () => {
  const [paymentsQueue, setPaymentsQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentsQueue = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // ✅ USAR SUPABASE CLIENT: v_dashboard_operaciones
      const { data, error } = await supabase
        .from('v_dashboard_operaciones')
        .select('*');

      if (error) throw error;
      setPaymentsQueue(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching payments queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsQueue();
  }, []);

  return {
    paymentsQueue,
    loading,
    error,
    fetchPaymentsQueue
  };
};