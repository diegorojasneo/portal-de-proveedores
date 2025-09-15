import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { MainPortal } from './components/portal/MainPortal';

const AppContent: React.FC = () => {
  const { user, isCheckingSession } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'forgot'>('login');

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