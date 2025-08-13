import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Save, Upload, FileText, CheckCircle, Info, X } from 'lucide-react';

export const SupplierConfiguration: React.FC = () => {
  const { user } = useAuth();
  const { suppliers } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get current supplier data
  const currentSupplier = suppliers.find(s => s.id === user?.id || s.id === '1');
  
  const [formData, setFormData] = useState({
    // General Data
    businessName: currentSupplier?.businessName || '',
    ruc: currentSupplier?.ruc || '',
    personType: 'juridica' as 'natural' | 'juridica',
    country: 'Perú',
    customCountry: '',
    fiscalAddress: currentSupplier?.address || '',
    contractedService: '',
    contactEmail: currentSupplier?.email || '',
    contactPhone: currentSupplier?.phone || '',
    rucFile: null as File | null,
    
    // Banking Information
    currency: 'PEN' as 'PEN' | 'USD',
    accountType: 'corriente' as 'corriente' | 'ahorros',
    accountNumber: currentSupplier?.bankAccounts?.[0]?.accountNumber || '',
    cci: currentSupplier?.bankAccounts?.[0]?.cci || '',
    
    // Additional Information (for juridica only)
    employeeCount: '',
    hasDiversity: false,
    diversityPercentage: '',
    annualRevenue: '',
    referenceClients: '',
    certifications: '',
    certificationsFile: null as File | null
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the configuration data
    console.log('Saving configuration:', formData);
    setIsSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const removeFile = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const personTypeOptions = [
    { value: 'natural', label: 'Persona Natural' },
    { value: 'juridica', label: 'Persona Jurídica' }
  ];

  const currencyOptions = [
    { value: 'PEN', label: 'Soles' },
    { value: 'USD', label: 'Dólares' }
  ];

  const accountTypeOptions = [
    { value: 'corriente', label: 'Corriente' },
    { value: 'ahorros', label: 'Ahorros' }
  ];

  const employeeCountOptions = [
    { value: 'none', label: 'Ningún trabajador' },
    { value: '0-20', label: 'Entre 0 a 20' },
    { value: '21-50', label: 'Entre 21 a 50' },
    { value: '51-100', label: 'Entre 51 a 100' },
    { value: '100+', label: 'Más de 100' }
  ];

  // Updated country options as requested
  const countryOptions = [
    { value: 'Perú', label: 'Perú' },
    { value: 'México', label: 'México' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'España', label: 'España' },
    { value: 'Otros', label: 'Otros' }
  ];

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent padding="large">
            <div className="w-16 h-16 bg-neo-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-neo-success" />
            </div>
            <h2 className="text-2xl font-pt-serif font-bold text-neo-primary mb-4">
              ¡Configuración Guardada!
            </h2>
            <p className="text-neo-gray-600 font-montserrat mb-6">
              Su información ha sido actualizada correctamente. Los cambios se reflejarán 
              en todo el sistema.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Continuar Editando
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
          Configuración del Proveedor
        </h1>
        <p className="text-neo-gray-600 font-montserrat">
          Actualice su información personal y empresarial
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Datos Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre completo o razón social"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
              
              <Input
                label="RUC"
                value={formData.ruc}
                onChange={(e) => handleInputChange('ruc', e.target.value)}
                required
              />
              
              <Select
                label="Tipo de persona"
                options={personTypeOptions}
                value={formData.personType}
                onChange={(e) => handleInputChange('personType', e.target.value)}
                required
              />
              
              <div>
                <Select
                  label="País"
                  options={countryOptions}
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                />
                {/* Show custom country field when "Otros" is selected */}
                {formData.country === 'Otros' && (
                  <div className="mt-3">
                    <Input
                      label="Por favor, indique su país"
                      value={formData.customCountry}
                      onChange={(e) => handleInputChange('customCountry', e.target.value)}
                      placeholder="Escriba el nombre de su país"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Input
                  label="Domicilio fiscal"
                  value={formData.fiscalAddress}
                  onChange={(e) => handleInputChange('fiscalAddress', e.target.value)}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Textarea
                  label="Servicio para el cual fue contratado"
                  value={formData.contractedService}
                  onChange={(e) => handleInputChange('contractedService', e.target.value)}
                  placeholder="Describa los servicios que presta a NEO Consulting..."
                  required
                />
              </div>
              
              <Input
                label="Correo electrónico del contacto principal"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                required
              />
              
              <Input
                label="Celular del contacto principal"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                required
              />
            </div>

            {/* RUC File Upload - Moved to General Data section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-neo-gray-700 mb-2 font-montserrat">
                Ficha RUC / CSF o RUT (PDF obligatorio) *
              </label>
              <div className="border-2 border-dashed border-neo-gray-300 rounded-lg p-4 text-center hover:border-neo-accent transition-colors">
                <Upload className="w-8 h-8 text-neo-gray-400 mx-auto mb-2" />
                <div className="space-y-2">
                  <label className="inline-block">
                    <span className="text-neo-accent font-montserrat font-medium cursor-pointer hover:underline">
                      Seleccionar archivo PDF
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('rucFile', e.target.files?.[0] || null)}
                      className="hidden"
                      required={!formData.rucFile}
                    />
                  </label>
                  <div className="flex items-center justify-center space-x-2">
                    <Info className="w-4 h-4 text-neo-info" />
                    <p className="text-xs text-neo-info font-montserrat">
                      Solo se permiten archivos PDF - Obligatorio
                    </p>
                  </div>
                </div>
                {formData.rucFile && (
                  <div className="mt-3 p-2 bg-neo-gray-50 rounded flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-neo-accent" />
                      <span className="text-sm font-montserrat text-neo-gray-700">
                        {formData.rucFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('rucFile')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banking Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>2. Información Bancaria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Moneda"
                options={currencyOptions}
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                required
              />
              
              <Select
                label="Tipo de cuenta"
                options={accountTypeOptions}
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                required
              />
              
              <Input
                label="Número de cuenta bancaria"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                required
              />
              
              <Input
                label="Número de cuenta interbancaria (CCI)"
                value={formData.cci}
                onChange={(e) => handleInputChange('cci', e.target.value)}
                helper="20 dígitos del código de cuenta interbancaria"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Section - Only for Juridica */}
        {formData.personType === 'juridica' && (
          <Card>
            <CardHeader>
              <CardTitle>3. Información Adicional (Persona Jurídica)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Select
                  label="Número de trabajadores"
                  options={employeeCountOptions}
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neo-gray-700 mb-3 font-montserrat">
                    ¿Diversidad de género y/o minorías en socios o accionistas?
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasDiversity"
                        checked={formData.hasDiversity === true}
                        onChange={() => handleInputChange('hasDiversity', true)}
                        className="text-neo-accent focus:ring-neo-accent"
                      />
                      <span className="font-montserrat text-neo-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasDiversity"
                        checked={formData.hasDiversity === false}
                        onChange={() => handleInputChange('hasDiversity', false)}
                        className="text-neo-accent focus:ring-neo-accent"
                      />
                      <span className="font-montserrat text-neo-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="Porcentaje de diversidad entre colaboradores"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.diversityPercentage}
                  onChange={(e) => handleInputChange('diversityPercentage', e.target.value)}
                  helper="Ingrese el porcentaje (0-100)"
                />

                <Input
                  label="Facturación anual (en soles)"
                  type="number"
                  value={formData.annualRevenue}
                  onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                  placeholder="Ej: 500000"
                  required
                />

                <Textarea
                  label="Clientes de referencia actuales"
                  value={formData.referenceClients}
                  onChange={(e) => handleInputChange('referenceClients', e.target.value)}
                  placeholder="Liste sus principales clientes actuales..."
                  rows={3}
                />

                <div>
                  <Textarea
                    label="Certificaciones"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="Describa las certificaciones que posee su empresa..."
                    rows={3}
                  />
                  
                  {/* Certifications File Upload */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neo-gray-700 mb-2 font-montserrat">
                      Adjuntar Certificaciones (Opcional)
                    </label>
                    <div className="border-2 border-dashed border-neo-gray-300 rounded-lg p-4 text-center hover:border-neo-accent transition-colors">
                      <Upload className="w-6 h-6 text-neo-gray-400 mx-auto mb-2" />
                      <div className="space-y-2">
                        <label className="inline-block">
                          <span className="text-neo-accent font-montserrat font-medium cursor-pointer hover:underline">
                            Seleccionar archivo PDF
                          </span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange('certificationsFile', e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </label>
                        <div className="flex items-center justify-center space-x-2">
                          <Info className="w-4 h-4 text-neo-info" />
                          <p className="text-xs text-neo-info font-montserrat">
                            Solo se permiten archivos PDF
                          </p>
                        </div>
                      </div>
                      {formData.certificationsFile && (
                        <div className="mt-3 p-2 bg-neo-gray-50 rounded flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-neo-accent" />
                            <span className="text-sm font-montserrat text-neo-gray-700">
                              {formData.certificationsFile.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile('certificationsFile')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" size="large" className="min-w-48">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </form>

      {/* Important Information Section - Updated with exact text requested */}
      <Card className="bg-gradient-to-r from-neo-primary to-neo-accent text-white">
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Info className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-pt-serif font-bold mb-4">
                🔵 Información Importante
              </h3>
              <div className="space-y-2 font-montserrat">
                <p>• Mantenga su información actualizada para evitar retrasos en los pagos</p>
                <p>• Los archivos PDF son obligatorios para validar su información fiscal</p>
                <p>• Los cambios pueden tardar hasta 24 horas en reflejarse completamente</p>
                <div className="mt-4">
                  <p className="font-semibold mb-2">Para soporte técnico contactar a:</p>
                  <div className="space-y-1 text-sm">
                    <p>• alisson.trauco@neo.com.pe</p>
                    <p>• lizbeth.zamora@neo.com.pe</p>
                    <p>• manuel.falcon@neo.com.pe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};