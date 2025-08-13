import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
let supabase: any;
let isSupabaseConfigured = false;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using mock client.');
  // Create a mock client that returns empty data
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null })
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [], error: null })
      }),
      update: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: [], error: null })
        })
      })
    })
  };
  isSupabaseConfigured = false;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  isSupabaseConfigured = true;
}

export { supabase, isSupabaseConfigured };

// 🔄 TIPOS ACTUALIZADOS PARA COINCIDIR CON ESQUEMA REAL
export interface Database {
  public: {
    Tables: {
      // ✅ TABLA REAL: suppliers
      suppliers: {
        Row: {
          id: string;
          email_login: string | null;
          password_hash: string | null;
          ruc: string;
          razon_social: string;
          nombre_comercial: string | null;
          tipo_persona: 'natural' | 'juridica';
          pais: string;
          direccion: string;
          tipo_comprobante_emitir: 'factura' | 'boleta' | 'recibo' | 'otro';
          ficha_ruc_url: string | null;
          contacto_nombre: string | null;
          contacto_email: string;
          contacto_telefono: string | null;
          solicitante_neo_email: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email_login?: string | null;
          password_hash?: string | null;
          ruc: string;
          razon_social: string;
          nombre_comercial?: string | null;
          tipo_persona: 'natural' | 'juridica';
          pais: string;
          direccion: string;
          tipo_comprobante_emitir: 'factura' | 'boleta' | 'recibo' | 'otro';
          ficha_ruc_url?: string | null;
          contacto_nombre?: string | null;
          contacto_email: string;
          contacto_telefono?: string | null;
          solicitante_neo_email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email_login?: string | null;
          password_hash?: string | null;
          ruc?: string;
          razon_social?: string;
          nombre_comercial?: string | null;
          tipo_persona?: 'natural' | 'juridica';
          pais?: string;
          direccion?: string;
          tipo_comprobante_emitir?: 'factura' | 'boleta' | 'recibo' | 'otro';
          ficha_ruc_url?: string | null;
          contacto_nombre?: string | null;
          contacto_email?: string;
          contacto_telefono?: string | null;
          solicitante_neo_email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // ✅ TABLA REAL: supplier_bank_accounts
      supplier_bank_accounts: {
        Row: {
          id: string;
          supplier_id: string;
          moneda: 'PEN' | 'USD';
          banco: string;
          numero_cuenta: string;
          tipo_cuenta: string;
          codigo_cci: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          moneda: 'PEN' | 'USD';
          banco: string;
          numero_cuenta: string;
          tipo_cuenta: string;
          codigo_cci?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          moneda?: 'PEN' | 'USD';
          banco?: string;
          numero_cuenta?: string;
          tipo_cuenta?: string;
          codigo_cci?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ✅ TABLA REAL: invoices
      invoices: {
        Row: {
          id: string;
          supplier_id: string;
          tipo_documento: 'factura' | 'boleta' | 'recibo' | 'otro';
          numero_documento: string;
          monto: number;
          moneda: 'PEN' | 'USD';
          tiene_detraccion: boolean;
          correo_aprobador: string;
          servicio_realizado: string | null;
          comprobante_pdf_url: string | null;
          status: 'pendiente' | 'aprobado' | 'rechazado';
          submitted_at: string;
          approved_at: string | null;
          rejected_at: string | null;
          aprobado_por: string | null;
          rechazo_motivo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          tipo_documento: 'factura' | 'boleta' | 'recibo' | 'otro';
          numero_documento: string;
          monto: number;
          moneda: 'PEN' | 'USD';
          tiene_detraccion?: boolean;
          correo_aprobador: string;
          servicio_realizado?: string | null;
          comprobante_pdf_url?: string | null;
          status?: 'pendiente' | 'aprobado' | 'rechazado';
          submitted_at?: string;
          approved_at?: string | null;
          rejected_at?: string | null;
          aprobado_por?: string | null;
          rechazo_motivo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          tipo_documento?: 'factura' | 'boleta' | 'recibo' | 'otro';
          numero_documento?: string;
          monto?: number;
          moneda?: 'PEN' | 'USD';
          tiene_detraccion?: boolean;
          correo_aprobador?: string;
          servicio_realizado?: string | null;
          comprobante_pdf_url?: string | null;
          status?: 'pendiente' | 'aprobado' | 'rechazado';
          submitted_at?: string;
          approved_at?: string | null;
          rejected_at?: string | null;
          aprobado_por?: string | null;
          rechazo_motivo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ✅ TABLA REAL: payments
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          amount: number;
          currency: 'PEN' | 'USD';
          status: 'pendiente' | 'programado' | 'pagado' | 'observado';
          method: 'transferencia' | 'yape_plin' | 'cheque' | 'otro' | null;
          estimated_payment_date: string | null;
          paid_at: string | null;
          bank_account_id: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          amount: number;
          currency: 'PEN' | 'USD';
          status?: 'pendiente' | 'programado' | 'pagado' | 'observado';
          method?: 'transferencia' | 'yape_plin' | 'cheque' | 'otro' | null;
          estimated_payment_date?: string | null;
          paid_at?: string | null;
          bank_account_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          amount?: number;
          currency?: 'PEN' | 'USD';
          status?: 'pendiente' | 'programado' | 'pagado' | 'observado';
          method?: 'transferencia' | 'yape_plin' | 'cheque' | 'otro' | null;
          estimated_payment_date?: string | null;
          paid_at?: string | null;
          bank_account_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ✅ TABLA REAL: operations_documents
      operations_documents: {
        Row: {
          id: string;
          title: string;
          tipo: 'contrato' | 'orden_compra' | 'acuerdo_confidencialidad' | 'manual_guia' | 'otro';
          description: string | null;
          file_url: string;
          published_at: string;
          is_active: boolean;
          audience_all: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          tipo: 'contrato' | 'orden_compra' | 'acuerdo_confidencialidad' | 'manual_guia' | 'otro';
          description?: string | null;
          file_url: string;
          published_at?: string;
          is_active?: boolean;
          audience_all?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          tipo?: 'contrato' | 'orden_compra' | 'acuerdo_confidencialidad' | 'manual_guia' | 'otro';
          description?: string | null;
          file_url?: string;
          published_at?: string;
          is_active?: boolean;
          audience_all?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: announcements
      announcements: {
        Row: {
          id: string;
          title: string;
          tipo: 'general' | 'operativo' | 'financiero' | 'otro';
          content: string;
          published_at: string;
          urgente: boolean;
          audience_all: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          tipo?: 'general' | 'operativo' | 'financiero' | 'otro';
          content: string;
          published_at?: string;
          urgente?: boolean;
          audience_all?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          tipo?: 'general' | 'operativo' | 'financiero' | 'otro';
          content?: string;
          published_at?: string;
          urgente?: boolean;
          audience_all?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: supplier_feedback
      supplier_feedback: {
        Row: {
          id: string;
          supplier_id: string;
          comunicacion: number;
          puntualidad_pagos: number;
          facilidad_portal: number;
          satisfaccion_general: number;
          comentarios: string | null;
          sugerencias: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          comunicacion: number;
          puntualidad_pagos: number;
          facilidad_portal: number;
          satisfaccion_general: number;
          comentarios?: string | null;
          sugerencias?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          comunicacion?: number;
          puntualidad_pagos?: number;
          facilidad_portal?: number;
          satisfaccion_general?: number;
          comentarios?: string | null;
          sugerencias?: string | null;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: operations_users
      operations_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };

      // ✅ TABLA REAL: approver_directory
      approver_directory: {
        Row: {
          id: string;
          approver_email: string;
          approver_name: string | null;
          area: string | null;
          is_active: boolean;
          created_at: string;
          email_login: string | null;
          password_hash: string | null;
        };
        Insert: {
          id?: string;
          approver_email: string;
          approver_name?: string | null;
          area?: string | null;
          is_active?: boolean;
          created_at?: string;
          email_login?: string | null;
          password_hash?: string | null;
        };
        Update: {
          id?: string;
          approver_email?: string;
          approver_name?: string | null;
          area?: string | null;
          is_active?: boolean;
          created_at?: string;
          email_login?: string | null;
          password_hash?: string | null;
        };
      };
    };
    Views: {
      // ✅ VISTA REAL: vw_supplier_dashboard_resumen
      vw_supplier_dashboard_resumen: {
        Row: {
          supplier_id: string | null;
          razon_social: string | null;
          comprobantes_registrados: number | null;
          comprobantes_aprobados: number | null;
          comprobantes_pendientes: number | null;
          comprobantes_rechazados: number | null;
          pagos_recibidos: number | null;
          monto_total_pagado: number | null;
        };
      };
      
      // ✅ VISTA REAL: vw_operations_dashboard_resumen
      vw_operations_dashboard_resumen: {
        Row: {
          total_comprobantes: number | null;
          total_aprobados: number | null;
          total_pendientes: number | null;
          total_rechazados: number | null;
          pagos_realizados: number | null;
          monto_pagado: number | null;
        };
      };

      // ✅ VISTA REAL: vw_approver_inbox
      vw_approver_inbox: {
        Row: {
          invoice_id: string | null;
          proveedor: string | null;
          numero_documento: string | null;
          monto: number | null;
          moneda: 'PEN' | 'USD' | null;
          tipo_documento: 'factura' | 'boleta' | 'recibo' | 'otro' | null;
          servicio_realizado: string | null;
          submitted_at: string | null;
          correo_aprobador: string | null;
          status: 'pendiente' | 'aprobado' | 'rechazado' | null;
        };
      };

      // ✅ VISTA REAL: vw_operations_payments_queue
      vw_operations_payments_queue: {
        Row: {
          invoice_id: string | null;
          proveedor: string | null;
          numero_documento: string | null;
          monto: number | null;
          moneda: 'PEN' | 'USD' | null;
          approved_at: string | null;
          tiene_detraccion: boolean | null;
          total_pagado_o_programado: number | null;
        };
      };
    };
  };
}