import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, Supplier, CompanyDocument, Announcement, FeedbackSurvey, Notification } from '../types';
import { addDays } from 'date-fns';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Documents
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => void;
  approveDocument: (id: string, code: string, budget: string) => void;
  rejectDocument: (id: string, reason: string) => void;
  getFilteredDocuments: () => Document[];
  
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  approveSupplier: (id: string) => void;
  rejectSupplier: (id: string) => void;
  disableSupplier: (id: string) => void;
  resetSupplierPassword: (id: string) => void;
  getFilteredSuppliers: () => Supplier[];
  
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
  
  // Payment Records
  getFilteredPaymentRecords: () => any[];
  
  // Stats
  stats: any;
  fetchSupplierStats: (userId: string) => void;
  fetchOperationsStats: () => void;
  fetchApproverInbox: (email: string) => void;
  
  // Registration status
  hasCompletedRegistration: (userId: string) => boolean;
  
  // Additional functions for operations and approvers
  submitSupplierRegistration: (data: any) => void;
  updatePaymentRecord: (id: string, updates: any) => void;
  paymentsQueue: any[];
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
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Actualización del Portal de Proveedores',
    content: 'Hemos actualizado nuestro portal con nuevas funcionalidades para mejorar su experiencia. Ahora pueden ver el estado de sus pagos en tiempo real y recibir notificaciones automáticas sobre el estado de sus comprobantes.',
    type: 'general',
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
  }
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [companyDocuments, setCompanyDocuments] = useState<CompanyDocument[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [feedbackSurveys, setFeedbackSurveys] = useState<FeedbackSurvey[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paymentsQueue, setPaymentsQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const addDocument = (doc: Omit<Document, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date()
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const approveDocument = (id: string, code: string, budget: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { 
            ...doc, 
            status: 'approved', 
            approvedBy: user?.name || 'Aprobador',
            approvedAt: new Date(),
            code,
            budget,
            estimatedPaymentDate: addDays(new Date(), 15),
            paymentStatus: 'scheduled'
          }
        : doc
    ));
  };

  const rejectDocument = (id: string, reason: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, status: 'rejected', rejectionReason: reason }
        : doc
    ));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSuppliers(prev => [newSupplier, ...prev]);
  };

  const approveSupplier = (id: string) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === id 
        ? { ...supplier, status: 'approved', updatedAt: new Date() }
        : supplier
    ));
  };

  const rejectSupplier = (id: string) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === id 
        ? { ...supplier, status: 'rejected', updatedAt: new Date() }
        : supplier
    ));
  };

  const disableSupplier = (id: string) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === id 
        ? { ...supplier, status: 'disabled', updatedAt: new Date() }
        : supplier
    ));
  };

  const resetSupplierPassword = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      console.log(`Password reset for ${supplier.email}`);
      addNotification({
        userId: id,
        title: 'Contraseña restablecida',
        message: 'Se ha enviado una nueva contraseña temporal a su correo electrónico.',
        type: 'info'
      });
    }
  };

  const addCompanyDocument = (doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: CompanyDocument = {
      ...doc,
      id: Date.now().toString(),
      uploadedAt: new Date()
    };
    setCompanyDocuments(prev => [newDoc, ...prev]);
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const submitFeedback = (feedback: Omit<FeedbackSurvey, 'id' | 'submittedAt'>) => {
    const newFeedback: FeedbackSurvey = {
      ...feedback,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    setFeedbackSurveys(prev => [newFeedback, ...prev]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const hasCompletedRegistration = (userId: string): boolean => {
    // Check if supplier has completed registration
    const supplier = suppliers.find(s => s.id === userId);
    return supplier ? supplier.status === 'approved' : false;
  };

  const submitSupplierRegistration = (data: any) => {
    // Mock implementation for supplier registration
    console.log('Supplier registration submitted:', data);
    addNotification({
      userId: user?.id || '1',
      title: 'Registro enviado',
      message: 'Su registro ha sido enviado para revisión.',
      type: 'success'
    });
  };

  const updatePaymentRecord = (id: string, updates: any) => {
    // Mock implementation for updating payment records
    console.log('Payment record updated:', id, updates);
    addNotification({
      userId: user?.id || '1',
      title: 'Pago actualizado',
      message: 'La información de pago ha sido actualizada.',
      type: 'info'
    });
  };

  const getFilteredDocuments = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'proveedor':
        return documents.filter(doc => doc.supplierId === user.id);
      case 'aprobador':
        return documents.filter(doc => doc.approverEmail === user.email);
      case 'operaciones':
        return documents;
      default:
        return [];
    }
  };

  const getFilteredSuppliers = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'operaciones':
        return suppliers;
      default:
        return [];
    }
  };

  const getFilteredPaymentRecords = () => {
    const filteredDocs = getFilteredDocuments();
    return filteredDocs
      .filter(doc => doc.status === 'approved')
      .map(doc => ({
        id: doc.id,
        documentNumber: doc.number,
        supplierName: suppliers.find(s => s.id === doc.supplierId)?.businessName || 'Proveedor',
        amount: doc.amount,
        currency: doc.currency,
        paymentStatus: doc.paymentStatus,
        estimatedPaymentDate: doc.estimatedPaymentDate,
        approvedAt: doc.approvedAt
      }));
  };

  const value = {
    documents,
    addDocument,
    approveDocument,
    rejectDocument,
    getFilteredDocuments,
    suppliers,
    addSupplier,
    approveSupplier,
    rejectSupplier,
    disableSupplier,
    resetSupplierPassword,
    getFilteredSuppliers,
    companyDocuments,
    addCompanyDocument,
    announcements,
    addAnnouncement,
    feedbackSurveys,
    submitFeedback,
    notifications,
    markNotificationAsRead,
    addNotification,
    getFilteredPaymentRecords,
    stats,
    fetchSupplierStats,
    fetchOperationsStats,
    fetchApproverInbox,
    hasCompletedRegistration,
    submitSupplierRegistration,
    updatePaymentRecord,
    paymentsQueue
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};