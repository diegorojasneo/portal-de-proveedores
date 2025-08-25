import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, Supplier, CompanyDocument, Announcement, FeedbackSurvey, Notification } from '../types';
import { addDays } from 'date-fns';
import { useAuth } from './AuthContext';
import { 
  useSuppliers, 
  useDocuments, 
  usePayments, 
  useAnnouncements, 
  useCompanyDocuments, 
  useFeedbackSurveys,
  useOperationsUsers,
  useApprovers,
  useDashboardStats,
  usePaymentsQueue
} from '../hooks/useSupabase';
import { supabase } from '../lib/supabase';

interface SupplierRegistrationData {
  userId: string;
  userEmail: string;
  // Datos Obligatorios
  ruc: string;
  businessName: string;
  personType: 'natural' | 'juridica';
  country: string;
  customCountry?: string;
  address: string;
  documentType: string;
  rucFile?: File | null;
  // Información de Contacto
  contactPerson?: string;
  contactPersonEmail?: string;
  phone?: string;
  neoContactEmail?: string;
  // Información Bancaria - Cuenta 1 (Soles)
  bankName1?: string;
  accountNumber1?: string;
  accountType1?: 'corriente' | 'ahorros';
  currency1?: 'PEN' | 'USD';
  cci1?: string;
  // Información Bancaria - Cuenta 2 (Dólares)
  bankName2?: string;
  accountNumber2?: string;
  accountType2?: 'corriente' | 'ahorros';
  currency2?: 'PEN' | 'USD';
  cci2?: string;
}

// 🔄 NUEVA INTERFAZ: Registro específico para el módulo de Pagos
interface PaymentRecord {
  id: string;
  comprobante_id: string; // 🔗 CAMPO PRINCIPAL: ID del comprobante relacionado
  documentNumber: string; // 🎯 CAMPO PRINCIPAL: Número de Documento extraído
  supplierId: string;
  supplierName?: string;
  documentType?: string;
  amount?: number; // 💰 CAMPO PRINCIPAL: Monto extraído
  currency?: string; // 💱 CAMPO PRINCIPAL: Moneda extraída
  estimatedPaymentDate?: Date;
  actualPaymentDate?: Date;
  paymentStatus: 'pending' | 'scheduled' | 'paid';
  paymentMethod?: string;
  bankAccount?: string;
  notes?: string;
  createdAt: Date; // 📅 CAMPO PRINCIPAL: Fecha de registro extraída
  updatedAt: Date;
}

interface AppContextType {
  // 🔄 NUEVAS FUNCIONES DE FILTRADO POR ROL
  getFilteredDocuments: () => Document[];
  getFilteredSuppliers: () => Supplier[];
  getFilteredPaymentRecords: () => PaymentRecord[];
  
  // Documents
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => void;
  approveDocument: (id: string, code: string, budget: string) => void;
  rejectDocument: (id: string, reason: string) => void;
  
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  approveSupplier: (id: string) => void;
  rejectSupplier: (id: string) => void;
  disableSupplier: (id: string) => void;
  resetSupplierPassword: (id: string) => void;
  
  // Supplier Registration
  supplierRegistrations: SupplierRegistrationData[];
  submitSupplierRegistration: (data: SupplierRegistrationData) => void;
  hasCompletedRegistration: (userId: string) => boolean;
  
  // 🔄 NUEVO: Gestión de Pagos
  paymentRecords: PaymentRecord[];
  updatePaymentRecord: (id: string, updates: Partial<PaymentRecord>) => void;
  
  // Company Documents
  companyDocuments: CompanyDocument[];
  addCompanyDocument: (doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>) => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  
  // Feedback
  feedbackSurveys: FeedbackSurvey[];
  submitFeedback: (feedback: Omit<FeedbackSurvey, 'id' | 'submittedAt'>) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    supplierId: '1',
    type: 'factura',
    number: 'F001-00123',
    amount: 2500,
    currency: 'PEN',
    hasDetraction: true,
    detractionPercentage: 10,
    detractionAmount: 250,
    detractionCode: '037',
    approverEmail: 'aprobador@neoconsulting.com',
    fileUrl: '#',
    deliverables: 'Consultoría en sistemas',
    servicePerformed: 'Desarrollo e implementación de sistema de gestión empresarial con módulos de facturación, inventario y reportes. Incluye capacitación al personal y soporte técnico durante 3 meses.',
    deliverablesFiles: [
      {
        id: '1',
        name: 'Informe_Consultoria_Sistemas.pdf',
        url: '#',
        type: 'application/pdf',
        size: 2048576
      },
      {
        id: '2',
        name: 'Analisis_Requerimientos.xlsx',
        url: '#',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1024000
      }
    ],
    status: 'approved',
    approvedBy: 'Carlos Rodríguez',
    approvedAt: new Date('2024-12-08'),
    createdAt: new Date('2024-12-07'),
    estimatedPaymentDate: addDays(new Date('2024-12-08'), 15),
    paymentStatus: 'scheduled',
    code: 'COD-2024-001',
    budget: 'PROY-SISTEMAS-2024'
  },
  {
    id: '2',
    supplierId: '1',
    type: 'boleta',
    number: 'B001-00456',
    amount: 850,
    currency: 'PEN',
    hasDetraction: false,
    approverEmail: 'aprobador@neoconsulting.com',
    fileUrl: '#',
    deliverables: 'Servicio de mantenimiento',
    servicePerformed: 'Mantenimiento preventivo y correctivo de equipos de cómputo, actualización de software y limpieza de sistemas durante el mes de noviembre 2024.',
    status: 'pending',
    createdAt: new Date('2024-12-09'),
    paymentStatus: 'pending'
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    ruc: '20123456789',
    businessName: 'Empresa ABC Sociedad Anónima Cerrada',
    tradeName: 'ABC Consulting',
    personType: 'juridica',
    country: 'Perú',
    address: 'Av. Javier Prado Este 123, San Isidro, Lima',
    phone: '01-234-5678',
    email: 'contacto@abcconsulting.com',
    contactPerson: 'Juan Pérez García',
    contactPhone: '987654321',
    contactEmail: 'juan.perez@abcconsulting.com',
    contractedService: 'Consultoría en sistemas de información y desarrollo de software',
    bankAccounts: [
      {
        id: '1',
        bankName: 'Banco de Crédito del Perú',
        accountNumber: '194-123456789-0-12',
        accountType: 'corriente',
        currency: 'PEN',
        cci: '00219400123456789012'
      }
    ],
    employeeCount: '21-50',
    hasDiversity: true,
    diversityPercentage: '35',
    annualRevenue: '2500000',
    referenceClients: 'Banco Continental, Telefónica del Perú, Rimac Seguros',
    certifications: 'ISO 9001:2015, ISO 27001:2013',
    status: 'approved',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: '2',
    ruc: '20987654321',
    businessName: 'Consultores XYZ EIRL',
    tradeName: 'XYZ Consulting',
    personType: 'juridica',
    country: 'Perú',
    address: 'Av. El Sol 456, Miraflores, Lima',
    phone: '01-987-6543',
    email: 'info@xyzconsulting.com',
    contactPerson: 'María González',
    contactPhone: '987123456',
    contactEmail: 'maria.gonzalez@xyzconsulting.com',
    contractedService: 'Servicios de auditoría y consultoría financiera',
    bankAccounts: [
      {
        id: '1',
        bankName: 'Banco Interbank',
        accountNumber: '898-123456789-0-15',
        accountType: 'corriente',
        currency: 'PEN',
        cci: '00389800123456789015'
      }
    ],
    employeeCount: '0-20',
    hasDiversity: false,
    diversityPercentage: '20',
    annualRevenue: '800000',
    referenceClients: 'Grupo Gloria, Backus, Alicorp',
    certifications: 'CPA, Certificación en NIIF',
    status: 'pending',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '3',
    ruc: 'PENDIENTE',
    businessName: 'Servicios Digitales SAC',
    tradeName: '',
    personType: 'juridica',
    country: 'Perú',
    address: 'Por completar',
    phone: 'Por completar',
    email: 'contacto@serviciosdigitales.com',
    contactPerson: 'Por completar',
    contactPhone: 'Por completar',
    contactEmail: 'contacto@serviciosdigitales.com',
    contractedService: 'Por completar',
    bankAccounts: [],
    status: 'pending_configuration',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  }
];

// 🔄 MOCK DATA: Registros de pagos iniciales (basados en documentos existentes)
const mockPaymentRecords: PaymentRecord[] = [
  {
    id: '1',
    documentNumber: 'F001-00123', // 🎯 Extraído del documento
    supplierId: '1',
    supplierName: 'Empresa ABC Sociedad Anónima Cerrada',
    documentType: 'factura',
    amount: 2500, // 💰 EXTRAÍDO AUTOMÁTICAMENTE
    currency: 'PEN', // 💱 EXTRAÍDO AUTOMÁTICAMENTE
    estimatedPaymentDate: addDays(new Date('2024-12-08'), 15),
    paymentStatus: 'scheduled',
    createdAt: new Date('2024-12-07'), // 📅 EXTRAÍDO AUTOMÁTICAMENTE
    updatedAt: new Date('2024-12-08')
  },
  {
    id: '2',
    documentNumber: 'B001-00456', // 🎯 Extraído del documento
    supplierId: '1',
    supplierName: 'Empresa ABC Sociedad Anónima Cerrada',
    documentType: 'boleta',
    amount: 850, // 💰 EXTRAÍDO AUTOMÁTICAMENTE
    currency: 'PEN', // 💱 EXTRAÍDO AUTOMÁTICAMENTE
    paymentStatus: 'pending',
    createdAt: new Date('2024-12-09'), // 📅 EXTRAÍDO AUTOMÁTICAMENTE
    updatedAt: new Date('2024-12-09')
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Actualización del Portal de Proveedores',
    content: 'Hemos actualizado nuestro portal con nuevas funcionalidades para mejorar su experiencia. Ahora pueden ver el estado de sus pagos en tiempo real y recibir notificaciones automáticas sobre el estado de sus comprobantes.',
    type: 'info',
    targetRole: 'all',
    createdBy: 'Sistema NEO',
    createdAt: new Date('2024-12-01'),
    isActive: true,
    attachments: [
      {
        name: 'Manual_Nuevas_Funcionalidades.pdf',
        url: '#',
        type: 'application/pdf'
      }
    ]
  },
  {
    id: '2',
    title: 'Nuevo Proceso de Aprobación - URGENTE',
    content: 'A partir del 15 de diciembre, todos los comprobantes deberán incluir el correo del aprobador correspondiente para agilizar el proceso. Los comprobantes sin esta información serán rechazados automáticamente.',
    type: 'warning',
    targetRole: 'proveedor',
    isUrgent: true,
    createdBy: 'Equipo de Operaciones',
    createdAt: new Date('2024-12-05'),
    isActive: true,
    scheduledDate: new Date('2024-12-15')
  },
  {
    id: '3',
    title: 'Felicitaciones por el Año 2024',
    content: 'Queremos agradecer a todos nuestros proveedores por su excelente trabajo durante este año. Su compromiso y calidad de servicio han sido fundamentales para nuestro éxito conjunto.',
    type: 'success',
    targetRole: 'proveedor',
    createdBy: 'Dirección General',
    createdAt: new Date('2024-12-10'),
    isActive: true
  }
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // 🔄 ACCESO AL CONTEXTO DE AUTENTICACIÓN
  const { user } = useAuth();
  
  // 🔄 USAR HOOKS DE SUPABASE PARA DATOS REALES
  const { 
    suppliers, 
    loading: suppliersLoading, 
    createSupplier, 
    updateSupplier 
  } = useSuppliers();
  
  const { 
    documents, 
    loading: documentsLoading, 
    createDocument, 
    updateDocument 
  } = useDocuments();
  
  const { 
    payments: paymentRecords, 
    loading: paymentsLoading, 
    updatePayment 
  } = usePayments();
  
  const { 
    announcements, 
    loading: announcementsLoading, 
    createAnnouncement 
  } = useAnnouncements();
  
  const { 
    companyDocuments, 
    loading: companyDocsLoading, 
    createCompanyDocument 
  } = useCompanyDocuments();
  
  const { 
    feedbackSurveys, 
    loading: feedbackLoading, 
    createFeedbackSurvey 
  } = useFeedbackSurveys();
  
  const { 
    operationsUsers, 
    loading: operationsLoading 
  } = useOperationsUsers();
  
  const { 
    approvers, 
    loading: approversLoading 
  } = useApprovers();
  
  const { 
    stats, 
    loading: statsLoading,
    fetchSupplierStats,
    fetchOperationsStats,
    fetchApproverInbox
  } = useDashboardStats();
  
  const { 
    paymentsQueue, 
    loading: paymentsQueueLoading 
  } = usePaymentsQueue();
  
  const [supplierRegistrations, setSupplierRegistrations] = useState<SupplierRegistrationData[]>([
    // Mock registration for user 1 (already completed)
    {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      userEmail: 'proveedor@example.com',
      ruc: '20123456789',
      businessName: 'Empresa ABC Sociedad Anónima Cerrada',
      personType: 'juridica',
      country: 'Perú',
      address: 'Av. Javier Prado Este 123, San Isidro, Lima',
      documentType: 'factura',
      contactPerson: 'Juan Pérez García',
      contactPersonEmail: 'juan.perez@abcconsulting.com',
      phone: '01-234-5678',
      neoContactEmail: 'contacto@neoconsulting.com',
      bankName1: 'Banco de Crédito del Perú',
      accountNumber1: '194-123456789-0-12',
      accountType1: 'corriente',
      currency1: 'PEN',
      cci1: '00219400123456789012',
      bankName2: 'Banco Interbank',
      accountNumber2: '898-123456789-0-15',
      accountType2: 'corriente',
      currency2: 'USD',
      cci2: '00389800123456789015'
    }
  ]);
  
  // 🔄 FUNCIONES DE FILTRADO POR ROL
  const getFilteredDocuments = (): Document[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'proveedor':
        // Proveedor: Solo sus propios documentos
        return documents.filter(doc => doc.supplierId === user.id);
        
      case 'aprobador':
        // Validador: Solo documentos pendientes de aprobación
        return documents.filter(doc => doc.status === 'pending');
        
      case 'operaciones':
        // Administrador: Solo documentos aprobados para gestión de pagos
        return documents.filter(doc => doc.status === 'approved');
        
      default:
        return documents;
    }
  };

  const getFilteredSuppliers = (): Supplier[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'proveedor':
        // Proveedor: Solo su propio perfil
        return suppliers.filter(supplier => supplier.id === user.id);
        
      case 'aprobador':
        // Validador: Solo proveedores pendientes de aprobación
        return suppliers.filter(supplier => supplier.status === 'pending');
        
      case 'operaciones':
        // Administrador: Solo proveedores aprobados
        return suppliers.filter(supplier => supplier.status === 'approved');
        
      default:
        return suppliers;
    }
  };

  const getFilteredPaymentRecords = (): PaymentRecord[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'proveedor':
        // Proveedor: Solo sus propios registros de pago
        return paymentRecords.filter(payment => payment.supplierId === user.id);
        
      case 'aprobador':
        // Validador: No necesita ver registros de pago
        return [];
        
      case 'operaciones':
        // Administrador: Todos los registros de pago para gestión
        return paymentRecords;
        
      default:
        return paymentRecords;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Agregar documento usando Supabase
  const addDocument = async (doc: Omit<Document, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    try {
      // Find the actual supplier ID from the database using the current user
      const currentSupplier = suppliers.find(supplier => 
        supplier.id === user?.id
      );
      
      if (!currentSupplier) {
        throw new Error('No se encontró el proveedor asociado a este usuario');
      }
      
      // ✅ CREAR DOCUMENTO EN TABLA REAL: invoices
      await createDocument({
        supplierId: currentSupplier.id,
        type: doc.type,
        number: doc.number,
        amount: doc.amount,
        currency: doc.currency,
        hasDetraction: doc.hasDetraction,
        approverEmail: doc.approverEmail,
        servicePerformed: doc.servicePerformed,
        fileUrl: doc.fileUrl
      });
      
      console.log('✅ DOCUMENTO CREADO EN BD REAL:');
      console.log('✅ Documento:', doc.number, `- ${doc.currency} ${doc.amount.toLocaleString()}`);
      console.log('✅ Pago creado automáticamente en tabla payments');
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Aprobar documento usando Supabase
  const approveDocument = async (id: string, code: string, budget: string) => {
    try {
      // ✅ ACTUALIZAR EN TABLA REAL: invoices
      await updateDocument(id, {
        status: 'aprobado',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      });
      
      console.log('✅ DOCUMENTO APROBADO EN BD REAL:', id);
    } catch (error) {
      console.error('Error approving document:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Rechazar documento usando Supabase
  const rejectDocument = async (id: string, reason: string) => {
    try {
      // ✅ ACTUALIZAR EN TABLA REAL: invoices
      await updateDocument(id, {
        status: 'rechazado',
        rejection_reason: reason,
        rejected_at: new Date().toISOString()
      });
      
      console.log('✅ DOCUMENTO RECHAZADO EN BD REAL:', id, '- Motivo:', reason);
    } catch (error) {
      console.error('Error rejecting document:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Agregar proveedor usando Supabase
  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      // ✅ CREAR PROVEEDOR EN TABLA REAL: suppliers
      await createSupplier({
        businessName: supplier.businessName,
        ruc: supplier.ruc,
        personType: supplier.personType,
        country: supplier.country,
        address: supplier.address,
        documentType: supplier.documentType,
        contactPerson: supplier.contactPerson,
        contactEmail: supplier.contactEmail,
        phone: supplier.phone,
        neoContactEmail: supplier.neoContactEmail,
        tradeName: supplier.tradeName,
        bankName1: supplier.bankAccounts?.[0]?.bankName,
        accountNumber1: supplier.bankAccounts?.[0]?.accountNumber,
        accountType1: supplier.bankAccounts?.[0]?.accountType,
        cci1: supplier.bankAccounts?.[0]?.cci,
        bankName2: supplier.bankAccounts?.[1]?.bankName,
        accountNumber2: supplier.bankAccounts?.[1]?.accountNumber,
        accountType2: supplier.bankAccounts?.[1]?.accountType,
        cci2: supplier.bankAccounts?.[1]?.cci
      });
      
      console.log('✅ PROVEEDOR CREADO EN BD REAL:');
      console.log('✅ Proveedor:', supplier.businessName);
      console.log('✅ Cuentas bancarias creadas automáticamente');
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Aprobar proveedor usando Supabase
  const approveSupplier = async (id: string) => {
    try {
      // ✅ ACTUALIZAR EN TABLA REAL: suppliers
      await updateSupplier(id, {
        is_active: true
      });
      
      console.log('✅ PROVEEDOR APROBADO EN BD REAL:', id);
    } catch (error) {
      console.error('Error approving supplier:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Rechazar proveedor usando Supabase
  const rejectSupplier = async (id: string) => {
    try {
      await updateSupplier(id, {
        is_active: false
      });
      
      console.log('✅ PROVEEDOR RECHAZADO EN BD REAL:', id);
    } catch (error) {
      console.error('Error rejecting supplier:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Deshabilitar proveedor usando Supabase
  const disableSupplier = async (id: string) => {
    try {
      await updateSupplier(id, {
        is_active: false
      });
      
      console.log('✅ PROVEEDOR DESHABILITADO EN BD REAL:', id);
    } catch (error) {
      console.error('Error disabling supplier:', error);
      throw error;
    }
  };

  const resetSupplierPassword = (id: string) => {
    // In a real application, this would generate a new temporary password
    // and send it via email to the supplier and copy to alisson.trauco@neo.com.pe
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      // Simulate email sending
      console.log(`Password reset for ${supplier.email} - Copy sent to alisson.trauco@neo.com.pe`);
      
      // Add notification to supplier
      addNotification({
        userId: id,
        title: 'Contraseña restablecida',
        message: 'Se ha enviado una nueva contraseña temporal a su correo electrónico.',
        type: 'info',
        actionUrl: '/configuration'
      });
    }
  };

  // 🔄 FUNCIÓN CORREGIDA: Envío de registro de proveedor
  const submitSupplierRegistration = async (data: SupplierRegistrationData) => {
    try {
      // 1. ✅ AGREGAR A REGISTROS LOCALES
      setSupplierRegistrations(prev => [...prev, data]);
      
      // 2. 🔄 CREAR AUTOMÁTICAMENTE EN SUPABASE
      await createSupplier({
        businessName: data.businessName,
        ruc: data.ruc,
        personType: data.personType,
        country: data.country,
        customCountry: data.customCountry,
        address: data.address,
        documentType: data.documentType,
        contactPerson: data.contactPerson,
        contactEmail: data.contactPersonEmail,
        phone: data.phone,
        neoContactEmail: data.neoContactEmail,
        bankName1: data.bankName1,
        accountNumber1: data.accountNumber1,
        accountType1: data.accountType1,
        cci1: data.cci1,
        bankName2: data.bankName2,
        accountNumber2: data.accountNumber2,
        accountType2: data.accountType2,
        cci2: data.cci2
      });
      
      console.log('🔄 REGISTRO DE PROVEEDOR PROCESADO EN SUPABASE:');
      console.log(`✅ Proveedor: ${data.businessName} (${data.ruc})`);
      console.log(`✅ Creado en base de datos con triggers automáticos`);
      console.log(`✅ Notificaciones enviadas automáticamente`);
    } catch (error) {
      console.error('Error submitting supplier registration:', error);
      throw error;
    }
  };

  const hasCompletedRegistration = (userId: string): boolean => {
    return supplierRegistrations.some(reg => reg.userId === userId);
  };

  // 🔄 NUEVA FUNCIÓN: Actualizar registros de pago (para Operaciones)
  const updatePaymentRecord = async (id: string, updates: Partial<PaymentRecord>) => {
    try {
      // ✅ ACTUALIZAR PAGO EN SUPABASE
      await updatePayment(id, updates);
      
      console.log(`🔄 Registro de pago actualizado en SUPABASE: ${id}`, updates);
    } catch (error) {
      console.error('Error updating payment record:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Agregar documento de empresa usando Supabase
  const addCompanyDocument = async (doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>) => {
    try {
      // ✅ CREAR DOCUMENTO DE EMPRESA EN SUPABASE
      await createCompanyDocument({
        name: doc.name,
        type: doc.type,
        description: doc.description,
        fileUrl: doc.fileUrl,
        supplierId: doc.supplierId,
        uploadedBy: doc.uploadedBy
      });
      
      console.log('🔄 DOCUMENTO DE EMPRESA CREADO EN SUPABASE:');
      console.log('✅ Documento:', doc.name);
      console.log('✅ Triggers automáticos ejecutados: Notificaciones enviadas');
    } catch (error) {
      console.error('Error creating company document:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Agregar comunicado usando Supabase
  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
      // ✅ CREAR COMUNICADO EN SUPABASE
      await createAnnouncement({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        targetRole: announcement.targetRole,
        targetSupplier: announcement.targetSupplier,
        isUrgent: announcement.isUrgent,
        scheduledDate: announcement.scheduledDate,
        attachments: announcement.attachments,
        createdBy: announcement.createdBy
      });
      
      console.log('🔄 COMUNICADO CREADO EN SUPABASE:');
      console.log('✅ Comunicado:', announcement.title);
      console.log('✅ Triggers automáticos ejecutados: Notificaciones enviadas');
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Enviar feedback usando Supabase
  const submitFeedback = async (feedback: Omit<FeedbackSurvey, 'id' | 'submittedAt'>) => {
    try {
      // ✅ CREAR FEEDBACK EN TABLA REAL: supplier_feedback
      await createFeedbackSurvey({
        supplierId: feedback.supplierId,
        communication: feedback.communication,
        paymentTiming: feedback.paymentTiming,
        platformUsability: feedback.platformUsability,
        overallSatisfaction: feedback.overallSatisfaction,
        comments: feedback.comments,
        suggestions: feedback.suggestions
      });
      
      console.log('✅ FEEDBACK CREADO EN BD REAL:');
      console.log('✅ Proveedor:', feedback.supplierName);
      console.log('✅ Calificación promedio:', feedback.rating);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Agregar notificación usando Supabase
  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      // ✅ CREAR NOTIFICACIÓN EN TABLA REAL (cuando esté disponible)
      console.log('✅ NOTIFICACIÓN CREADA:', notification.title);
      
      // TODO: Implementar cuando se cree tabla de notificaciones
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  // 🔄 NUEVA FUNCIÓN: Marcar notificación como leída usando Supabase
  const markNotificationAsRead = async (id: string) => {
    try {
      // ✅ MARCAR COMO LEÍDA EN TABLA REAL (cuando esté disponible)
      console.log('✅ NOTIFICACIÓN MARCADA COMO LEÍDA:', id);
      
      // TODO: Implementar cuando se cree tabla de notificaciones
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const value = {
    // 🔄 FUNCIONES DE FILTRADO
    getFilteredDocuments,
    getFilteredSuppliers,
    getFilteredPaymentRecords,
    
    // 🔄 DATOS REALES DE SUPABASE
    documents,
    addDocument,
    approveDocument,
    rejectDocument,
    suppliers,
    addSupplier,
    approveSupplier,
    rejectSupplier,
    disableSupplier,
    resetSupplierPassword,
    supplierRegistrations,
    submitSupplierRegistration,
    hasCompletedRegistration,
    // 🔄 NUEVAS FUNCIONES DE PAGOS
    paymentRecords: paymentRecords || [],
    updatePaymentRecord,
    companyDocuments,
    addCompanyDocument,
    announcements,
    addAnnouncement,
    feedbackSurveys,
    submitFeedback,
    notifications: [], // TODO: Implementar cuando se cree tabla
    markNotificationAsRead,
    addNotification,
    // 🔄 NUEVOS DATOS DE BD REAL
    operationsUsers,
    approvers,
    stats,
    paymentsQueue,
    fetchSupplierStats,
    fetchOperationsStats,
    fetchApproverInbox,
    // 🔄 ESTADOS DE CARGA
    loading: {
      suppliers: suppliersLoading,
      documents: documentsLoading,
      payments: paymentsLoading,
      announcements: announcementsLoading,
      companyDocuments: companyDocsLoading,
      feedback: feedbackLoading,
      operations: operationsLoading,
      approvers: approversLoading,
      stats: statsLoading,
      paymentsQueue: paymentsQueueLoading
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};