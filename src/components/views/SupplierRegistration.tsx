import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Save, CheckCircle, UserCheck, Building2, Mail, CreditCard, Upload, FileText, X, Info } from 'lucide-react';

export const SupplierRegistration: React.FC = () => {
  const { user } = useAuth();
  const { submitSupplierRegistration } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Datos Obligatorios
    ruc: '',
    businessName: '',
    personType: 'juridica' as 'natural' | 'juridica',
    country: 'Perú',
    customCountry: '',
    address: '',
    documentType: '',
    rucFile: null as File | null,
    
    // Información de Contacto
    contactPerson: '',
    contactPersonEmail: '',
    phone: '',
    neoContactEmail: '',
    
    // Información Bancaria - Cuenta 1 (Soles)
    bankName1: '',
    accountNumber1: '',
    accountType1: 'corriente' as 'corriente' | 'ahorros',
    currency1: 'PEN' as 'PEN' | 'USD',
    cci1: '',
    
    // Información Bancaria - Cuenta 2 (Dólares)
    bankName2: '',
    accountNumber2: '',
    accountType2: 'corriente' as 'corriente' | 'ahorros',
    currency2: 'USD' as 'PEN' | 'USD',
    cci2: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, rucFile: file }));
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, rucFile: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit the registration
    submitSupplierRegistration({
      ...formData,
      userId: user?.id || '',
      userEmail: user?.email || ''
    });
    
    setIsSubmitted(true);
  };

  const personTypeOptions = [
    { value: 'juridica', label: 'Jurídica' },
    { value: 'natural', label: 'Natural' }
  ];

  const countryOptions = [
    { value: 'Perú', label: 'Perú' },
    { value: 'México', label: 'México' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'España', label: 'España' },
    { value: 'Otros', label: 'Otros' }
  ];

  const documentTypeOptions = [
    { value: 'factura', label: 'Factura' },
    { value: 'rhe', label: 'Recibo por Honorarios' }
  ];

  const accountTypeOptions = [
    { value: 'corriente', label: 'Corriente' },
    { value: 'ahorros', label: 'Ahorros' }
  ];

  const currencyOptions = [
    { value: 'PEN', label: 'Soles (PEN)' },
    { value: 'USD', label: 'Dólares (USD)' }
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
              ¡Registro enviado!
            </h2>
            <p className="text-neo-gray-600 font-montserrat mb-6">
              Nuestro equipo revisará tu información y te contactará en caso sea necesario.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-montserrat text-blue-800">
                <strong>Información enviada a:</strong><br />
                • alisson.trauco@neo.com.pe<br />
                • lizbeth.zamora@neo.com.pe
              </p>
            </div>
            <Button onClick={() => {
              setIsSubmitted(false);
              setFormData({
                ruc: '',
                businessName: '',
                personType: 'juridica',
                country: 'Perú',
                customCountry: '',
                address: '',
                documentType: '',
                rucFile: null,
                contactPerson: '',
                contactPersonEmail: '',
                phone: '',
                neoContactEmail: '',
                bankName1: '',
                accountNumber1: '',
                accountType1: 'corriente',
                currency1: 'PEN',
                cci1: '',
                bankName2: '',
                accountNumber2: '',
                accountType2: 'corriente',
                currency2: 'USD',
                cci2: ''
              });
            }}>
              Editar Información
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
          📄 Registro del Proveedor
        </h1>
        <p className="text-neo-gray-600 font-montserrat">
          Complete su información para registrarse como proveedor de NEO Consulting
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Datos Obligatorios Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Datos Obligatorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="RUC"
                value={formData.ruc}
                onChange={(e) => handleInputChange('ruc', e.target.value)}
                placeholder="20123456789"
                required
              />
              
              <Input
                label="Razón Social"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Empresa ABC SAC"
                required
              />
              
              <Select
                label="Tipo de Persona"
                options={personTypeOptions}
                value={formData.personType}
                onChange={(e) => handleInputChange('personType', e.target.value)}
                required
              />
              
              <Select
                label="País"
                options={countryOptions}
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
              />
              
              {formData.country === 'Otros' && (
                <div className="md:col-span-2">
                  <Input
                    label="Especifique su país"
                    value={formData.customCountry}
                    onChange={(e) => handleInputChange('customCountry', e.target.value)}
                    placeholder="Escriba el nombre de su país"
                    required
                  />
                </div>
              )}
              
              <div className="md:col-span-2">
                <Input
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Av. Javier Prado Este 123, San Isidro, Lima"
                  required
                />
              </div>
              
              <Select
                label="Tipo de Comprobante a Emitir"
                options={documentTypeOptions}
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                required
              />
            </div>

            {/* RUC File Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-neo-gray-700 mb-2 font-montserrat">
                Adjuntar Ficha RUC *
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
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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
                      onClick={removeFile}
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

        {/* Contact Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Persona de contacto"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Juan Pérez García"
              />
              
              <Input
                label="Email de la persona de contacto"
                type="email"
                value={formData.contactPersonEmail}
                onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)}
                placeholder="juan.perez@empresa.com"
              />
              
              <Input
                label="Teléfono"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="01-234-5678"
              />
              
              <Input
                label="Correo de NEO que solicitó el servicio"
                type="email"
                value={formData.neoContactEmail}
                onChange={(e) => handleInputChange('neoContactEmail', e.target.value)}
                placeholder="contacto@neoconsulting.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Banking Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Información Bancaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Informational Text */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-neo-info flex-shrink-0 mt-0.5" />
                <p className="text-sm font-montserrat text-blue-800">
                  <strong>Es indispensable llenar 2 tipos de cuenta:</strong><br />
                  1. En soles y 2. En dólares
                </p>
              </div>
            </div>

            {/* Cuenta 1 - Soles */}
            <div className="mb-8">
              <h4 className="text-lg font-pt-serif font-semibold text-neo-primary mb-4 border-b border-neo-gray-200 pb-2">
                Cuenta 1 - Soles (PEN)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Banco"
                  value={formData.bankName1}
                  onChange={(e) => handleInputChange('bankName1', e.target.value)}
                  placeholder="Banco de Crédito del Perú"
                />
                
                <Input
                  label="Número de cuenta bancaria"
                  value={formData.accountNumber1}
                  onChange={(e) => handleInputChange('accountNumber1', e.target.value)}
                  placeholder="194-123456789-0-12"
                />
                
                <Select
                  label="Tipo de cuenta"
                  options={accountTypeOptions}
                  value={formData.accountType1}
                  onChange={(e) => handleInputChange('accountType1', e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-neo-gray-700 mb-1 font-montserrat">
                    Tipo de moneda
                  </label>
                  <input
                    type="text"
                    value="Soles (PEN)"
                    className="w-full px-3 py-2 border border-neo-gray-300 rounded-lg font-montserrat bg-gray-100"
                    disabled
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Código CCI"
                    value={formData.cci1}
                    onChange={(e) => handleInputChange('cci1', e.target.value)}
                    placeholder="00219400123456789012"
                    helper="Código de Cuenta Interbancaria (20 dígitos)"
                  />
                </div>
              </div>
            </div>

            {/* Cuenta 2 - Dólares */}
            <div>
              <h4 className="text-lg font-pt-serif font-semibold text-neo-primary mb-4 border-b border-neo-gray-200 pb-2">
                Cuenta 2 - Dólares (USD)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Banco"
                  value={formData.bankName2}
                  onChange={(e) => handleInputChange('bankName2', e.target.value)}
                  placeholder="Banco Interbank"
                />
                
                <Input
                  label="Número de cuenta bancaria"
                  value={formData.accountNumber2}
                  onChange={(e) => handleInputChange('accountNumber2', e.target.value)}
                  placeholder="898-123456789-0-15"
                />
                
                <Select
                  label="Tipo de cuenta"
                  options={accountTypeOptions}
                  value={formData.accountType2}
                  onChange={(e) => handleInputChange('accountType2', e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-neo-gray-700 mb-1 font-montserrat">
                    Tipo de moneda
                  </label>
                  <input
                    type="text"
                    value="Dólares (USD)"
                    className="w-full px-3 py-2 border border-neo-gray-300 rounded-lg font-montserrat bg-gray-100"
                    disabled
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Código CCI"
                    value={formData.cci2}
                    onChange={(e) => handleInputChange('cci2', e.target.value)}
                    placeholder="00389800123456789015"
                    helper="Código de Cuenta Interbancaria (20 dígitos)"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="large" className="min-w-48">
            <UserCheck className="w-4 h-4 mr-2" />
            Enviar información
          </Button>
        </div>
      </form>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-neo-primary to-neo-accent text-white">
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-pt-serif font-bold mb-2">
                Información Importante
              </h3>
              <div className="space-y-2 text-sm font-montserrat">
                <p>• Los campos marcados con (*) son obligatorios</p>
                <p>• Su información será revisada por nuestro equipo</p>
                <p>• Recibirá una confirmación una vez aprobado su registro</p>
                <p>• Para consultas, contacte a nuestro equipo de soporte</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};