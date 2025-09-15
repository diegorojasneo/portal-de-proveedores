import React from 'react';
import { FileText, DollarSign, Clock, CheckCircle, Building2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export const DashboardStats: React.FC = () => {
  const { 
    getFilteredDocuments, 
    getFilteredSuppliers, 
    getFilteredPaymentRecords,
    stats,
    fetchSupplierStats,
    fetchOperationsStats,
    fetchApproverInbox
  } = useApp();
  const { user } = useAuth();

  // 🔄 USAR DATOS FILTRADOS POR ROL
  const documents = getFilteredDocuments();
  const suppliers = getFilteredSuppliers();
  const paymentRecords = getFilteredPaymentRecords();

  // ✅ CARGAR ESTADÍSTICAS REALES DESDE VISTAS DE SUPABASE
  useEffect(() => {
    if (user?.role === 'proveedor' && user?.id) {
      fetchSupplierStats(user.id);
    } else if (user?.role === 'operaciones') {
      fetchOperationsStats();
    } else if (user?.role === 'aprobador' && user?.email) {
      fetchApproverInbox(user.email);
    }
  }, [user, fetchSupplierStats, fetchOperationsStats, fetchApproverInbox]);
  const getStats = () => {
    if (user?.role === 'proveedor') {
      // ✅ USAR ESTADÍSTICAS REALES DESDE VISTA: vw_supplier_dashboard_resumen
      if (stats) {
        return [
          {
            title: 'Comprobantes Registrados',
            value: stats.comprobantes_registrados || 0,
            icon: FileText,
            color: 'text-neo-accent',
            bgColor: 'bg-blue-50',
            subtitle: `Total registrados`
          },
          {
            title: 'Aprobados',
            value: stats.comprobantes_aprobados || 0,
            icon: CheckCircle,
            color: 'text-neo-success',
            bgColor: 'bg-green-50',
            subtitle: 'Documentos aprobados'
          },
          {
            title: 'Pendientes',
            value: stats.comprobantes_pendientes || 0,
            icon: Clock,
            color: 'text-neo-warning',
            bgColor: 'bg-yellow-50',
            subtitle: 'Por aprobar'
          },
          {
            title: 'Pagos Recibidos',
            value: stats.pagos_recibidos || 0,
            icon: DollarSign,
            color: 'text-neo-info',
            bgColor: 'bg-blue-50',
            subtitle: `S/ ${(stats.monto_total_pagado || 0).toLocaleString()}`
          }
        ];
      }
      
      // Fallback a datos locales si no hay stats de BD
      return [
        {
          title: 'Total Proveedores',
          value: suppliers.length,
          icon: Building2,
          color: 'text-neo-accent',
          bgColor: 'bg-blue-50',
          subtitle: 'Proveedores registrados'
        },
        {
          title: 'Proveedores Activos',
          value: suppliers.filter(s => s.status === 'approved').length,
          icon: CheckCircle,
          color: 'text-neo-success',
          bgColor: 'bg-green-50',
          subtitle: 'Aprobados y activos'
        },
        {
          title: 'Pendientes Revisión',
          value: suppliers.filter(s => s.status === 'pending').length,
          icon: Clock,
          color: 'text-neo-warning',
          bgColor: 'bg-yellow-50',
          subtitle: 'Por revisar'
        },
        {
          title: 'Total Documentos',
          value: documents.length,
          icon: FileText,
          color: 'text-neo-accent',
          bgColor: 'bg-blue-50',
          subtitle: 'Comprobantes procesados'
        },
        {
          title: 'Aprobados',
          value: documents.filter(doc => doc.status === 'approved').length,
          icon: CheckCircle,
          color: 'text-neo-success',
          bgColor: 'bg-green-50',
          subtitle: 'Documentos aprobados'
        },
        {
          title: 'Pendientes',
          value: documents.filter(doc => doc.status === 'pending').length,
          icon: Clock,
          color: 'text-neo-warning',
          bgColor: 'bg-yellow-50',
          subtitle: 'Por aprobar'
        },
        {
          title: 'Pagos Recibidos',
          value: paymentRecords.filter(p => p.paymentStatus === 'paid').length,
          icon: DollarSign,
          color: 'text-neo-info',
          bgColor: 'bg-blue-50',
          subtitle: 'Pagos completados'
        }
      ];
    }

    if (user?.role === 'aprobador') {
      // ✅ USAR ESTADÍSTICAS REALES DESDE VISTA: vw_approver_inbox
      if (stats && stats.documents) {
        const totalAmount = stats.documents.reduce((sum: number, doc: any) => sum + (doc.monto || 0), 0);
        
        return [
          {
            title: 'Para Validar',
            value: stats.pendingDocuments || 0,
            icon: Clock,
            color: 'text-neo-warning',
            bgColor: 'bg-yellow-50',
            subtitle: 'Requieren validación'
          },
          {
            title: 'Monto Total',
            value: `S/ ${totalAmount.toLocaleString()}`,
            icon: FileText,
            color: 'text-neo-accent',
            bgColor: 'bg-blue-50',
            subtitle: 'Por validar'
          }
        ];
      }
      
      // Fallback a datos locales
      return [
        {
          title: 'Para Validar',
          value: documents.length,
          icon: Clock,
          color: 'text-neo-warning',
          bgColor: 'bg-yellow-50',
          subtitle: 'Requieren validación'
        },
        {
          title: 'Monto Total',
          value: `S/ ${documents.reduce((sum, doc) => sum + doc.amount, 0).toLocaleString()}`,
          icon: FileText,
          color: 'text-neo-accent',
          bgColor: 'bg-blue-50',
          subtitle: 'Por validar'
        }
      ];
    }

    return [];
  };

  const calculatedStats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {calculatedStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200" hover>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-pt-serif font-bold text-neo-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-neo-gray-600 font-montserrat">
                  {stat.title}
                </p>
                {/* 🔄 NUEVA LÍNEA: Información adicional */}
                {stat.subtitle && (
                  <p className="text-xs text-neo-gray-500 font-montserrat mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};