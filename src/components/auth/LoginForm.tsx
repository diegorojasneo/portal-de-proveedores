import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('📝 Form submitted with:', { email, password: '***' });

    if (!email || !password) {
      setError('Por favor ingresa todos los campos');
      return;
    }

    console.log('🚀 Calling login function...');
    const success = await login(email, password);
    console.log('📊 Login result:', success);
    
    if (!success) {
      setError('Credenciales incorrectas o usuario no autorizado. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neo-primary via-neo-accent to-neo-info flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neo-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-pt-serif font-bold text-2xl">N</span>
          </div>
          <h1 className="text-2xl font-pt-serif font-bold text-neo-primary mb-2">
            NEO Consulting
          </h1>
          <p className="text-neo-gray-600 font-montserrat">
            Portal de Proveedores
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neo-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neo-gray-300 rounded-lg font-montserrat focus:outline-none focus:ring-2 focus:ring-neo-accent focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neo-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-neo-gray-300 rounded-lg font-montserrat focus:outline-none focus:ring-2 focus:ring-neo-accent focus:border-transparent"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-neo-gray-400 hover:text-neo-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-neo-gray-400 hover:text-neo-gray-600" />
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-montserrat">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="large"
            isLoading={isLoading}
            className="w-full bg-neo-accent hover:bg-blue-700 text-white font-montserrat font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neo-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onForgotPassword}
            className="text-neo-accent hover:text-neo-primary font-montserrat text-sm transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-neo-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm font-montserrat text-neo-gray-600 mb-3">
            Usuarios de prueba:
          </p>
          <div className="space-y-2 text-xs font-montserrat text-neo-gray-700">
            <div className="bg-white rounded p-2 border">
              <p><strong>Proveedor:</strong> proveedor@test.com / password123</p>
            </div>
            <div className="bg-white rounded p-2 border">
              <p><strong>Aprobador:</strong> aprobador@test.com / password123</p>
            </div>
            <div className="bg-white rounded p-2 border">
              <p><strong>Administrador:</strong> operaciones@test.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};