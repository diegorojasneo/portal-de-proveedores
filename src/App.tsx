import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { MainPortal } from './components/portal/MainPortal';
import { isSupabaseConfigured } from './lib/supabase';

const AppContent: React.FC = () => {
  const { user, isCheckingSession } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'forgot'>('login');

  // Show Supabase configuration message if not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neo-primary via-neo-accent to-neo-info flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-neo-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-pt-serif font-bold text-2xl">N</span>
          </div>
          <h2 className="text-xl font-pt-serif font-bold text-neo-primary mb-4">
            Configuración Requerida
          </h2>
          <p className="text-neo-gray-600 font-montserrat mb-6">
            Para usar el Portal de Proveedores, necesitas conectar tu proyecto de Supabase.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm font-montserrat text-blue-800 mb-2">
              <strong>Pasos para configurar:</strong>
            </p>
            <ol className="text-sm font-montserrat text-blue-700 space-y-1">
              <li>1. Haz clic en "Connect to Supabase" en la esquina superior derecha</li>
              <li>2. Crea o conecta tu proyecto de Supabase</li>
              <li>3. Aplica las migraciones de la base de datos</li>
              <li>4. ¡Listo para usar!</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking for existing session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neo-primary via-neo-accent to-neo-info flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-neo-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-pt-serif font-bold text-2xl">N</span>
          </div>
          <p className="text-neo-gray-600 font-montserrat">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {authView === 'login' && (
          <LoginForm onForgotPassword={() => setAuthView('forgot')} />
        )}
        {authView === 'forgot' && (
          <ForgotPasswordForm onBack={() => setAuthView('login')} />
        )}
      </>
    );
  }

  return <MainPortal />;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;