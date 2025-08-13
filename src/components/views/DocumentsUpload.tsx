import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, FileText, CheckCircle, Info, X, Paperclip, AlertTriangle, Plus, Trash2 } from 'lucide-react';

export const DocumentsUpload: React.FC = () => {
  const { addDocument, hasCompletedRegistration } = useApp();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    number: '',
    amount: '',
    currency: 'PEN',
    hasDetraction: false,
    detractionPercentage: '',
    detractionAmount: '',
    detractionCode: '',
    approverEmail: '',
    file: null as File | null,
    servicePerformed: '',
    // 🔄 NUEVO: Array de entregables múltiples
    deliverables: [
      {
        id: '1',
        files: [] as File[]
      }
    ]
  });

  // Check if user has completed registration
  const registrationCompleted = hasCompletedRegistration(user?.id || '');

  const documentTypes = [
    { value: 'factura', label: 'Factura' },
    { value: 'boleta', label: 'Boleta' },
    { value: 'recibo', label: 'Recibo' },
    { value: 'otro', label: 'Otro' }
  ];

  const currencyOptions = [
    { value: 'PEN', label: 'Soles (PEN)' },
    { value: 'USD', label: 'Dólares (USD)' }
  ];

  const detractionCodes = [
    { value: '001', label: '001 - Azúcar y melaza de caña' },
    { value: '002', label: '002 - Arroz' },
    { value: '003', label: '003 - Alcohol etílico' },
    { value: '004', label: '004 - Recursos hidrobiológicos' },
    { value: '005', label: '005 - Maíz amarillo duro' },
    { value: '007', label: '007 - Caña de azúcar' },
    { value: '008', label: '008 - Madera' },
    { value: '009', label: '009 - Arena y piedra' },
    { value: '010', label: '010 - Residuos, desechos y subproductos' },
    { value: '011', label: '011 - Bienes gravados con IGV o por renuncia (exoneración)' },
    { value: '012', label: '012 - Intermediación laboral y tercerización' },
    { value: '013', label: '013 - Animales vivos' },
    { value: '014', label: '014 - Carnes y despojos comestibles' },
    { value: '015', label: '015 - Abonos, cueros y pieles' },
    { value: '016', label: '016 - Aceite de pescado' },
    { value: '017', label: '017 - Harina, polvo, pellets de pescado y mariscos' },
    { value: '019', label: '019 - Arrendamiento de bienes muebles' },
    { value: '020', label: '020 - Mantenimiento y reparación de bienes muebles' },
    { value: '021', label: '021 - Movimiento de carga' },
    { value: '022', label: '022 - Otros servicios empresariales' },
    { value: '023', label: '023 - Leche' },
    { value: '024', label: '024 - Comisión mercantil' },
    { value: '025', label: '025 - Fabricación de bienes por encargo' },
    { value: '026', label: '026 - Servicio de transporte de personas' },
    { value: '027', label: '027 - Servicio de transporte de carga' },
    { value: '028', label: '028 - Transporte de pasajeros' },
    { value: '030', label: '030 - Contratos de construcción' },
    { value: '031', label: '031 - Oro gravado con el IGV' },
    { value: '032', label: '032 - Páprika y frutos capsicum/pimienta' },
    { value: '034', label: '034 - Minerales metálicos no auríferos' },
    { value: '035', label: '035 - Bienes exonerados del IGV' },
    { value: '036', label: '036 - Oro y minerales exonerados del IGV' },
    { value: '037', label: '037 - Demás servicios gravados con el IGV' },
    { value: '039', label: '039 - Minerales no metálicos' },
    { value: '040', label: '040 - Bien inmueble gravado con IGV' },
    { value: '041', label: '041 - Plomo' },
    { value: '099', label: '099 - Ley 30737' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔄 CONVERTIR MÚLTIPLES ENTREGABLES A FORMATO ESPERADO
    const allDeliverablesFiles: any[] = [];
    let fileIndex = 1;
    
    formData.deliverables.forEach((deliverable, deliverableIndex) => {
      deliverable.files.forEach((file) => {
        allDeliverablesFiles.push({
          id: fileIndex.toString(),
          name: file.name,
          url: '#', // In real app, this would be the uploaded file URL
          type: file.type,
          size: file.size,
          deliverableGroup: deliverableIndex + 1 // Para identificar a qué grupo pertenece
        });
        fileIndex++;
      });
    });

    const documentData = {
      supplierId: user?.id || '1',
      type: formData.type as any,
      number: formData.number,
      amount: parseFloat(formData.amount),
      currency: formData.currency as 'PEN' | 'USD',
      hasDetraction: formData.hasDetraction,
      detractionPercentage: formData.hasDetraction ? parseFloat(formData.detractionPercentage) : undefined,
      detractionAmount: formData.hasDetraction ? parseFloat(formData.detractionAmount) : undefined,
      detractionCode: formData.hasDetraction ? formData.detractionCode : undefined,
      approverEmail: formData.approverEmail,
      servicePerformed: formData.servicePerformed,
      fileUrl: '#', // In real app, this would be the uploaded file URL
      deliverables: `${formData.deliverables.length} grupo(s) de entregables con ${allDeliverablesFiles.length} archivo(s) total`, // Auto-generated description
      deliverablesFiles: allDeliverablesFiles.length > 0 ? allDeliverablesFiles : undefined
    };

    addDocument(documentData);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate detraction amount when percentage or amount changes
      if (field === 'detractionPercentage' || field === 'amount') {
        if (newData.hasDetraction && newData.detractionPercentage && newData.amount) {
          const percentage = parseFloat(newData.detractionPercentage);
          const amount = parseFloat(newData.amount);
          if (!isNaN(percentage) && !isNaN(amount)) {
            newData.detractionAmount = ((amount * percentage) / 100).toFixed(2);
          }
        }
      }
      
      // Clear detraction fields when unchecking
      if (field === 'hasDetraction' && !value) {
        newData.detractionPercentage = '';
        newData.detractionAmount = '';
        newData.detractionCode = '';
      }
      
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  // 🔄 NUEVAS FUNCIONES PARA MANEJAR MÚLTIPLES ENTREGABLES
  const addNewDeliverable = () => {
    const newId = (formData.deliverables.length + 1).toString();
    setFormData(prev => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        {
          id: newId,
          files: []
        }
      ]
    }));
  };

  const removeDeliverable = (deliverableId: string) => {
    if (formData.deliverables.length > 1) {
      setFormData(prev => ({
        ...prev,
        deliverables: prev.deliverables.filter(d => d.id !== deliverableId)
      }));
    }
  };

  const handleDeliverablesFilesChange = (deliverableId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension);
    });

    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(deliverable =>
        deliverable.id === deliverableId
          ? { ...deliverable, files: [...deliverable.files, ...validFiles] }
          : deliverable
      )
    }));
  };

  const removeDeliverablesFile = (deliverableId: string, fileIndex: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(deliverable =>
        deliverable.id === deliverableId
          ? { ...deliverable, files: deliverable.files.filter((_, i) => i !== fileIndex) }
          : deliverable
      )
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (deliverableId: string, e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension);
    });

    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(deliverable =>
        deliverable.id === deliverableId
          ? { ...deliverable, files: [...deliverable.files, ...validFiles] }
          : deliverable
      )
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    // Basic form validation
    if (!formData.type || !formData.number || !formData.amount || !formData.approverEmail || !formData.file) {
      return false;
    }
    
    // ✅ VALIDACIÓN OBLIGATORIA: Debe tener factura Y entregables
    const hasFacturaPDF = !!formData.file;
    const hasEntregables = formData.deliverables.some(deliverable => deliverable.files.length > 0);
    
    return hasFacturaPDF && hasEntregables;
  };

  // Calcular totales para mostrar
  const totalFiles = formData.deliverables.reduce((total, deliverable) => total + deliverable.files.length, 0);
  const totalDeliverables = formData.deliverables.length;

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent padding="large">
            <div className="w-16 h-16 bg-neo-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-neo-success" />
            </div>
            <h2 className="text-2xl font-pt-serif font-bold text-neo-primary mb-4">
              ¡Comprobante Enviado!
            </h2>
            <p className="text-neo-gray-600 font-montserrat mb-6">
              Su comprobante ha sido enviado correctamente para revisión. 
              Recibirá una notificación cuando sea aprobado o si necesita correcciones.
            </p>
            <div className="space-y-2 text-sm font-montserrat">
              <p><strong>Tipo:</strong> {documentTypes.find(t => t.value === formData.type)?.label}</p>
              <p><strong>Número:</strong> {formData.number}</p>
              <p><strong>Monto:</strong> {formData.currency} {parseFloat(formData.amount).toLocaleString()}</p>
              {formData.hasDetraction && (
                <>
                  <p><strong>Detracción:</strong> {formData.detractionPercentage}% - {formData.currency} {parseFloat(formData.detractionAmount).toLocaleString()}</p>
                  <p><strong>Código SUNAT:</strong> {formData.detractionCode}</p>
                </>
              )}
              <p><strong>Servicio Realizado:</strong> {formData.servicePerformed}</p>
              {totalFiles > 0 && (
                <p><strong>Entregables:</strong> {totalDeliverables} grupo(s) con {totalFiles} archivo(s) total</p>
              )}
            </div>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  type: '',
                  number: '',
                  amount: '',
                  currency: 'PEN',
                  hasDetraction: false,
                  detractionPercentage: '',
                  detractionAmount: '',
                  detractionCode: '',
                  approverEmail: '',
                  file: null,
                  servicePerformed: '',
                  servicePerformed: '',
                  deliverables: [
                    {
                      id: '1',
                      files: []
                    }
                  ]
                });
              }}
              className="mt-6"
            >
              Registrar Otro Comprobante
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-pt-serif font-bold text-neo-primary mb-2">
          Registrar Comprobantes
        </h1>
        <p className="text-neo-gray-600 font-montserrat">
          Complete el formulario para registrar su comprobante de pago
        </p>
      </div>

      {/* Registration Warning */}
      {!registrationCompleted && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-neo-warning" />
              </div>
              <div>
                <h3 className="text-lg font-pt-serif font-bold text-neo-primary mb-2">
                  🕐 Importante
                </h3>
                <p className="text-neo-gray-700 font-montserrat">
                  Para registrar comprobantes, primero debes completar tu registro como proveedor en la sección 
                  <strong> "Registro del Proveedor"</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del Comprobante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Tipo de Documento"
                options={documentTypes}
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                required
                disabled={!registrationCompleted}
              />
              
              <Input
                label="Número de Documento"
                placeholder="Ej: F001-00123"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                required
                disabled={!registrationCompleted}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Monto"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
                disabled={!registrationCompleted}
              />
              
              <Select
                label="Moneda"
                options={currencyOptions}
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                required
                disabled={!registrationCompleted}
              />

              <div className="flex items-center space-x-2 mt-8">
                <input
                  type="checkbox"
                  id="hasDetraction"
                  checked={formData.hasDetraction}
                  onChange={(e) => handleInputChange('hasDetraction', e.target.checked)}
                  className="rounded border-neo-gray-300 text-neo-accent focus:ring-neo-accent"
                  disabled={!registrationCompleted}
                />
                <label htmlFor="hasDetraction" className="text-sm font-montserrat text-neo-gray-700">
                  Tiene detracción
                </label>
              </div>
            </div>

            {/* Detraction Fields - Only show when hasDetraction is true */}
            {formData.hasDetraction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="w-5 h-5 text-neo-info" />
                  <h3 className="font-montserrat font-semibold text-neo-primary">
                    Información de Detracción
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Porcentaje de Detracción"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Ej: 12.00"
                    value={formData.detractionPercentage}
                    onChange={(e) => handleInputChange('detractionPercentage', e.target.value)}
                    helper="Ingrese el porcentaje sin el símbolo %"
                    required
                    disabled={!registrationCompleted}
                  />

                  <Input
                    label="Monto de Detracción"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.detractionAmount}
                    onChange={(e) => handleInputChange('detractionAmount', e.target.value)}
                    helper="Se calcula automáticamente o puede editarse"
                    required
                    disabled={!registrationCompleted}
                  />

                  <div className="md:col-span-1">
                    <Select
                      label="Código de Detracción SUNAT"
                      options={detractionCodes}
                      value={formData.detractionCode}
                      onChange={(e) => handleInputChange('detractionCode', e.target.value)}
                      helper="Seleccione el código correspondiente según SUNAT"
                      required
                      disabled={!registrationCompleted}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm font-montserrat text-blue-800">
                    <strong>Nota:</strong> El monto de detracción se calcula automáticamente basado en el porcentaje ingresado. 
                    Puede modificar el monto manualmente si es necesario.
                  </p>
                </div>
              </div>
            )}

            <Input
              label="Correo del Aprobador"
              type="email"
              placeholder="aprobador@neoconsulting.com"
              value={formData.approverEmail}
              onChange={(e) => handleInputChange('approverEmail', e.target.value)}
              helper="Ingrese el correo del colaborador que debe aprobar este comprobante"
              required
              disabled={!registrationCompleted}
            />

            <Textarea
              label="Servicio Realizado"
              value={formData.servicePerformed}
              onChange={(e) => handleInputChange('servicePerformed', e.target.value)}
              placeholder="Describa detalladamente el servicio realizado para este comprobante..."
              helper="Especifique el tipo de servicio, actividades realizadas, período de trabajo, etc."
              required
              disabled={!registrationCompleted}
            />

            {/* 🔄 NUEVA SECCIÓN: Múltiples entregables */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-5 h-5 text-red-600" />
                  <h3 className="font-montserrat font-semibold text-neo-primary">
                    Archivos de Entregables *
                  </h3>
                  <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full font-montserrat font-bold animate-pulse">
                    Obligatorio
                  </span>
                </div>
                
                {/* ✅ BOTÓN PARA AGREGAR MÁS ENTREGABLES */}
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={addNewDeliverable}
                  disabled={!registrationCompleted}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Entregable</span>
                </Button>
              </div>

              {/* Información de resumen */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-neo-info" />
                  <p className="text-sm font-montserrat text-blue-800">
                    <strong>Total:</strong> {totalDeliverables} grupo(s) de entregables con {totalFiles} archivo(s)
                  </p>
                </div>
              </div>

              {/* 🔄 RENDERIZAR MÚLTIPLES ENTREGABLES */}
              <div className="space-y-6">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={deliverable.id} className="border border-green-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-montserrat font-medium text-neo-primary">
                        📁 Entregable {index + 1}
                      </h4>
                      {formData.deliverables.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="small"
                          onClick={() => removeDeliverable(deliverable.id)}
                          disabled={!registrationCompleted}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </Button>
                      )}
                    </div>

                    {/* File Upload Area */}
                    <div 
                      className={`border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors ${
                        !registrationCompleted ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(deliverable.id, e)}
                    >
                      <Upload className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="space-y-2">
                        <p className="text-sm font-montserrat text-neo-gray-600">
                          Arrastra archivos aquí o
                        </p>
                        <label className="inline-block">
                          <span className={`text-neo-success font-montserrat font-medium cursor-pointer hover:underline ${
                            !registrationCompleted ? 'cursor-not-allowed' : ''
                          }`}>
                            selecciona archivos
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
                            multiple
                            onChange={(e) => handleDeliverablesFilesChange(deliverable.id, e)}
                            className="hidden"
                            disabled={!registrationCompleted}
                          />
                        </label>
                        <p className="text-xs text-neo-gray-400 font-montserrat">
                          PDF, XLS, XLSX, JPG, PNG - Máximo 10MB por archivo
                        </p>
                      </div>
                    </div>

                    {/* Display uploaded files for this deliverable */}
                    {deliverable.files.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-montserrat font-medium text-neo-gray-700 mb-2">
                          Archivos en este entregable ({deliverable.files.length}):
                        </h5>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {deliverable.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-neo-success" />
                                <div>
                                  <span className="text-sm font-montserrat text-neo-gray-700 block">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-neo-gray-500 font-montserrat">
                                    {formatFileSize(file.size)}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDeliverablesFile(deliverable.id, fileIndex)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                disabled={!registrationCompleted}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ❌ VALIDACIÓN: Mostrar error si no hay archivos */}
              {totalFiles === 0 && (
                <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-700" />
                    <p className="text-sm font-montserrat text-red-800 font-bold">
                      <strong>❌ ERROR:</strong> Debes adjuntar al menos un entregable para continuar.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-neo-info flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-montserrat font-medium text-red-800 mb-1">
                      🚨 ARCHIVOS OBLIGATORIOS
                    </h4>
                    <ul className="text-sm font-montserrat text-red-700 space-y-1">
                      <li>• <strong>📄 Factura PDF:</strong> Archivo obligatorio del comprobante</li>
                      <li>• <strong>📁 Entregables:</strong> Al menos un archivo de entregables es obligatorio</li>
                      <li>• <strong>🔒 Validación:</strong> Sin estos archivos no podrá enviar el comprobante</li>
                      <li>• <strong>✅ Formatos:</strong> PDF, Excel, imágenes para entregables</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neo-gray-700 mb-2 font-montserrat">
        {/* ✅ VALIDACIÓN VISUAL MEJORADA: Error si falta factura */}
        {!formData.file && (
          <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-700" />
              <p className="text-sm font-montserrat text-red-800 font-bold">
                <strong>❌ ERROR:</strong> Debes adjuntar el archivo PDF de la factura para continuar.
              </p>
            </div>
          </div>
        )}

                📄 Archivo PDF del Comprobante * (OBLIGATORIO)
              </label>
              <div className={`border-2 border-dashed border-neo-gray-300 rounded-lg p-6 text-center hover:border-neo-accent transition-colors ${
                !registrationCompleted ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <Upload className="w-12 h-12 text-neo-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-montserrat text-neo-gray-600">
                    📄 Arrastra tu factura PDF aquí o
                  </p>
                  <label className="inline-block">
                    <span className={`text-neo-accent font-montserrat font-medium cursor-pointer hover:underline ${
                      !registrationCompleted ? 'cursor-not-allowed' : ''
                    }`}>
                      selecciona un archivo
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                      disabled={!registrationCompleted}
                    />
                  </label>
                  <p className="text-xs text-neo-gray-400 font-montserrat">
                    📄 Solo archivos PDF, máximo 10MB - OBLIGATORIO
                  </p>
                </div>
                {formData.file && (
                  <div className="mt-4 p-3 bg-neo-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-neo-accent" />
                      <span className="text-sm font-montserrat text-neo-gray-700">
                        {formData.file.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" disabled={!registrationCompleted}>
                Cancelar
              </Button>
              
              {/* ✅ VALIDACIÓN COMPLETA EN EL BOTÓN */}
              {!isFormValid() && (
                <div className="flex flex-col items-end">
                  <Button 
                    type="submit"
                    disabled={true}
                    className="bg-red-500 text-white cursor-not-allowed opacity-50"
                  >
                    ❌ {!formData.file && totalFiles === 0 
                      ? "Faltan Factura y Entregables" 
                      : !formData.file 
                      ? "Falta Factura PDF" 
                      : "Faltan Entregables"}
                  </Button>
                  <p className="text-xs text-red-600 font-montserrat mt-1">
                    Debes adjuntar la factura y al menos un entregable
                  </p>
                </div>
              )}
              
              {/* ✅ BOTÓN HABILITADO SOLO CUANDO TODO ESTÁ COMPLETO */}
              {isFormValid() && (
                <Button 
                  type="submit"
                  disabled={!registrationCompleted}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✅ Enviar para Aprobación
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};