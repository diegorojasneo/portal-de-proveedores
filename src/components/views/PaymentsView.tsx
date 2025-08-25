import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { DollarSign, Calendar, CheckCircle, Clock, FileText, AlertCircle, Award } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { getFilteredPaymentRecords, getFilteredDocuments } = useApp();
  const { user } = useAuth();

  // 🔄 USAR DATOS FILTRADOS POR ROL
  const userPaymentRecords = getFilteredPaymentRecords();
  const documents = getFilteredDocuments();
  
  // Calcular estadísticas basadas en registros de pago
  const totalRecords = userPaymentRecords.length;
  const scheduledPayments = userPaymentRecords.filter(payment => payment.paymentStatus === 'scheduled');
  const paidPayments = userPaymentRecords.filter(payment => payment.paymentStatus === 'paid');
  const pendingPayments = userPaymentRecords.filter(payment => payment.paymentStatus === 'pending');
  
  const totalScheduledAmount = scheduledPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalPaidAmount = paidPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const getPaymentStatusBadge = (status: string) => {
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
  };

  // 🔄 NUEVA FUNCIÓN: Obtener estado de aprobación del documento
  const getDocumentApprovalStatus = (payment: any) => {
    const document = documents.find(doc => doc.id === payment.comprobante_id);
    if (!document) {
      return <Badge variant="warning">Sin documento</Badge>;
    }
    
    switch (document.status) {
      case 'approved':
        return <Badge variant="success">Aprobado</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rechazado</Badge>;
      default:
        return <Badge>{document.status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-neo-success" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-neo-info" />;
      default:
        return <Clock className="w-5 h-5 text-neo-warning" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-pt-serif font-bold text-neo-primary mb-2">
          💳 Estado de Pagos - Mis Comprobantes
        </h1>
        <p className="text-neo-gray-600 font-montserrat">
          Seguimiento de tus comprobantes registrados y estado de pagos
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <FileText className="w-6 h-6 text-neo-info" />
              </div>
              <div>
                <p className="text-2xl font-pt-serif font-bold text-neo-primary">
                  {totalRecords}
                </p>
                <p className="text-sm text-neo-gray-600 font-montserrat">
                  Total Registrados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 mr-4">
                <DollarSign className="w-6 h-6 text-neo-success" />
              </div>
              <div>
                <p className="text-2xl font-pt-serif font-bold text-neo-primary">
                  S/ {totalPaidAmount.toLocaleString()}
                </p>
                <p className="text-sm text-neo-gray-600 font-montserrat">
                  Total Pagado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <Calendar className="w-6 h-6 text-neo-info" />
              </div>
              <div>
                <p className="text-2xl font-pt-serif font-bold text-neo-primary">
                  S/ {totalScheduledAmount.toLocaleString()}
                </p>
                <p className="text-sm text-neo-gray-600 font-montserrat">
                  Programado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50 mr-4">
                <Clock className="w-6 h-6 text-neo-warning" />
              </div>
              <div>
                <p className="text-2xl font-pt-serif font-bold text-neo-primary">
                  {pendingPayments.length}
                </p>
                <p className="text-sm text-neo-gray-600 font-montserrat">
                  Pendientes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 Detalle de Pagos - Sincronizado Automáticamente</CardTitle>
        </CardHeader>
        <CardContent>
          {userPaymentRecords.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-neo-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-neo-gray-400" />
              </div>
              <p className="text-neo-gray-500 font-montserrat">
                No hay comprobantes registrados aún
              </p>
              <p className="text-sm text-neo-gray-400 font-montserrat mt-2">
                Los comprobantes aparecerán aquí automáticamente al registrarlos
              </p>
            </div>
          ) : (
            <>
              {/* Information Banner */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-neo-info flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-montserrat font-medium text-blue-800 mb-1">
                      🔄 Sincronización Automática
                    </h4>
                    <p className="text-sm font-montserrat text-blue-700">
                      Esta tabla se actualiza automáticamente cuando registra un comprobante. 
                      Los campos de monto y fechas son completados por el equipo de Operaciones tras la aprobación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neo-gray-200">
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        📅 Fecha Registro
                      </th>
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        🎯 Comprobante
                      </th>
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        Monto
                      </th>
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        Fecha Est. Pago
                      </th>
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        Estado del Pago
                      </th>
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        Aprobación del Documento
                      </th>
                      <th className="text-left py-3 px-4 font-montserrat font-semibold text-neo-primary">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPaymentRecords.map((payment) => (
                      <tr key={payment.id} className="border-b border-neo-gray-100 hover:bg-neo-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-neo-accent" />
                            <div>
                              <p className="text-sm font-montserrat font-medium text-neo-primary">
                                {payment.createdAt.toLocaleDateString()}
                              </p>
                              {payment.updatedAt && payment.updatedAt.getTime() !== payment.createdAt.getTime() && (
                                <p className="text-xs text-neo-gray-400 font-montserrat">
                                  Actualizado: {payment.updatedAt.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(payment.paymentStatus)}
                            <div>
                              <p className="font-montserrat font-medium text-neo-primary">
                                🎯 {payment.documentNumber}
                              </p>
                              {payment.documentType && (
                                <p className="text-sm text-neo-gray-600 font-montserrat capitalize">
                                  {payment.documentType}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {payment.amount && payment.currency ? (
                            <p className="font-montserrat font-medium text-neo-primary">
                              {payment.currency} {payment.amount.toLocaleString()}
                            </p>
                          ) : (
                            <p className="text-sm text-neo-gray-400 font-montserrat italic">
                              Por completar
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {payment.estimatedPaymentDate ? (
                            <div>
                              <p className="text-sm font-montserrat text-neo-gray-600">
                                {payment.estimatedPaymentDate.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-neo-gray-400 font-montserrat">
                                ({formatDistanceToNow(payment.estimatedPaymentDate, { addSuffix: true, locale: es })})
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-neo-gray-400 font-montserrat italic">
                              Por definir
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {getPaymentStatusBadge(payment.paymentStatus)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-neo-accent" />
                            {getDocumentApprovalStatus(payment)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {payment.notes ? (
                            <p className="text-sm font-montserrat text-neo-gray-600">
                              {payment.notes}
                            </p>
                          ) : (
                            <p className="text-sm text-neo-gray-400 font-montserrat italic">
                              Sin notas
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-neo-primary to-neo-accent text-white">
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-pt-serif font-bold mb-3">
                🔄 Cómo funciona la sincronización automática
              </h3>
              <div className="space-y-2 text-sm font-montserrat">
                <p>• <strong>Paso 1:</strong> Al registrar un comprobante, se extrae automáticamente el "Número de Documento"</p>
                <p>• <strong>Paso 2:</strong> Se crea un registro en esta tabla con estado "Pendiente"</p>
                <p>• <strong>Paso 3:</strong> El documento pasa por aprobación (visible en "Aprobación del Documento")</p>
                <p>• <strong>Paso 4:</strong> Operaciones completa los campos de monto, fechas y estado del pago</p>
                <p>• <strong>Paso 5:</strong> Usted puede ver el progreso en tiempo real aquí</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};