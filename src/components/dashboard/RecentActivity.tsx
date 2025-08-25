import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Bell, Users, CheckCircle, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const { getFilteredDocuments, getFilteredSuppliers, notifications, getFilteredPaymentRecords } = useApp();
  const { user } = useAuth();

  // 🔄 USAR DATOS FILTRADOS POR ROL
  const documents = getFilteredDocuments();
  const suppliers = getFilteredSuppliers();
  const paymentRecords = getFilteredPaymentRecords();

  const getRecentActivities = () => {
    const activities = [];

    if (user?.role === 'proveedor') {
      // 🔄 MOSTRAR ACTIVIDAD BASADA EN REGISTROS DE PAGOS Y DOCUMENTOS
      const userPayments = paymentRecords.slice(0, 3); // Ya filtrados por rol
      
      const userDocs = documents.slice(0, 2); // Ya filtrados por rol
      
      // 🔄 AGREGAR ACTIVIDADES DE REGISTROS DE PAGOS
      userPayments.forEach(payment => {
        const relatedDoc = documents.find(doc => doc.id === payment.id);
        activities.push({
          id: payment.id,
          type: 'payment',
          title: `💰 Registro de Pago: ${payment.documentNumber}`,
          status: payment.paymentStatus,
          date: payment.createdAt,
          description: payment.amount && payment.currency 
            ? `${payment.currency} ${payment.amount.toLocaleString()} - ${payment.paymentStatus === 'paid' ? 'Pagado' : payment.paymentStatus === 'scheduled' ? 'Programado' : 'Pendiente'}`
            : 'Monto por completar por Operaciones',
          documentStatus: relatedDoc?.status || 'unknown'
        });
      });
      
      // 🔄 AGREGAR ACTIVIDADES DE DOCUMENTOS
      userDocs.forEach(doc => {
        activities.push({
          id: doc.id,
          type: 'document',
          title: `📄 Comprobante ${doc.type.toUpperCase()} ${doc.number}`,
          status: doc.status,
          date: doc.createdAt,
          description: `${doc.currency} ${doc.amount.toLocaleString()} - ${doc.status === 'approved' ? 'Aprobado' : doc.status === 'pending' ? 'En revisión' : 'Rechazado'}`,
          documentStatus: doc.status
        });
      });
      
    } else if (user?.role === 'aprobador') {
      // Solo documentos pendientes de aprobación
      const pendingDocs = documents.slice(0, 5); // Ya filtrados por rol
      
      pendingDocs.forEach(doc => {
        activities.push({
          id: doc.id,
          type: 'document',
          title: `📋 ${doc.type.toUpperCase()} ${doc.number}`,
          status: doc.status,
          date: doc.createdAt,
          description: `${doc.currency} ${doc.amount.toLocaleString()} - Requiere validación`
        });
      });
    }

    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6); // 🔄 MOSTRAR MÁS ACTIVIDADES
  };

  const activities = getRecentActivities();

  const getStatusBadge = (status: string, type: string = 'document') => {
    if (type === 'payment') {
      switch (status) {
        case 'paid':
          return <Badge variant="success">Pagado</Badge>;
        case 'scheduled':
          return <Badge variant="info">Programado</Badge>;
        case 'pending':
          return <Badge variant="warning">Pendiente</Badge>;
        default:
          return <Badge>{status}</Badge>;
      }
    }
    
    // Document status badges
    switch (status) {
      case 'approved':
        return <Badge variant="success">Aprobado</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rechazado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-neo-accent" />;
      case 'payment':
        return status === 'paid' 
          ? <DollarSign className="w-5 h-5 text-neo-success" />
          : status === 'scheduled'
          ? <Calendar className="w-5 h-5 text-neo-info" />
          : <DollarSign className="w-5 h-5 text-neo-warning" />;
      case 'supplier':
        return <Users className="w-5 h-5 text-neo-info" />;
      case 'notification':
        return <Bell className="w-5 h-5 text-neo-warning" />;
      default:
        return <CheckCircle className="w-5 h-5 text-neo-success" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔄 Actividad Reciente - Actualizada Dinámicamente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-neo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-neo-gray-400" />
            </div>
            <p className="text-neo-gray-500 font-montserrat">No hay actividad reciente</p>
            <p className="text-sm text-neo-gray-400 font-montserrat mt-2">
              La actividad aparecerá aquí cuando registre comprobantes
            </p>
          </div>
        ) : (
          <>
            {/* 🔄 BANNER INFORMATIVO */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-neo-info flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-montserrat font-medium text-blue-800 mb-1">
                    📊 Dashboard Dinámico
                  </h4>
                  <p className="text-sm font-montserrat text-blue-700">
                    Esta sección se actualiza automáticamente cuando registra comprobantes, 
                    mostrando tanto los documentos como sus registros de pago correspondientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-neo-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-montserrat font-medium text-neo-primary truncate">
                        {activity.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(activity.status, activity.type)}
                        {/* 🔄 MOSTRAR ESTADO DEL DOCUMENTO SI ES UN PAGO */}
                        {activity.type === 'payment' && activity.documentStatus && activity.documentStatus !== 'unknown' && (
                          <Badge variant={activity.documentStatus === 'approved' ? 'success' : activity.documentStatus === 'pending' ? 'warning' : 'danger'}>
                            Doc: {activity.documentStatus === 'approved' ? 'Aprobado' : activity.documentStatus === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neo-gray-600 font-montserrat mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neo-gray-400 font-montserrat">
                        {formatDistanceToNow(activity.date, { addSuffix: true, locale: es })}
                      </p>
                      {/* 🔄 INDICADOR DE TIPO DE ACTIVIDAD */}
                      <span className={`text-xs px-2 py-1 rounded-full font-montserrat ${
                        activity.type === 'payment' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.type === 'document'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type === 'payment' ? '💰 Pago' : activity.type === 'document' ? '📄 Documento' : '🏢 Proveedor'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};