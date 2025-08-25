import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isCheckingSession: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        setIsCheckingSession(true);
        console.log('🔍 Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('📋 Session data:', session);
        
        if (session?.user) {
          console.log('👤 Found authenticated user:', session.user.email);
          // Get additional user info from portal_users table
          const { data: portalUser } = await supabase
            .from('portal_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          console.log('🏢 Portal user data:', portalUser);
          
          if (portalUser) {
            const userData: User = {
              id: portalUser.user_id,
              email: portalUser.email,
              name: portalUser.full_name || 'Usuario',
              role: portalUser.role as 'proveedor' | 'aprobador' | 'operaciones',
              createdAt: new Date(portalUser.created_at),
              lastLogin: new Date()
            };
            console.log('✅ Setting user data:', userData);
            setUser(userData);
          } else {
            console.log('❌ No portal user found for authenticated user');
            // Try to find user by email as fallback
            const { data: portalUserByEmail } = await supabase
              .from('portal_users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (portalUserByEmail) {
              console.log('✅ Found portal user by email:', portalUserByEmail);
              const userData: User = {
                id: portalUserByEmail.id,
                email: portalUserByEmail.email,
                name: portalUserByEmail.full_name || 'Usuario',
                role: portalUserByEmail.role as 'proveedor' | 'aprobador' | 'operaciones',
                createdAt: new Date(portalUserByEmail.created_at),
                lastLogin: new Date()
              };
              setUser(userData);
            }
          }
        } else {
          console.log('❌ No authenticated session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👤 User signed in:', session.user.email);
          // Get additional user info from portal_users table
          const { data: portalUser } = await supabase
            .from('portal_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          console.log('🏢 Portal user for signed in user:', portalUser);
          
          if (portalUser) {
            const userData: User = {
              id: portalUser.user_id,
              email: portalUser.email,
              name: portalUser.full_name || 'Usuario',
              role: portalUser.role as 'proveedor' | 'aprobador' | 'operaciones',
              createdAt: new Date(portalUser.created_at),
              lastLogin: new Date()
            };
            setUser(userData);
          } else {
            // Try to find user by email as fallback
            const { data: portalUserByEmail } = await supabase
              .from('portal_users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (portalUserByEmail) {
              const userData: User = {
                id: portalUserByEmail.id,
                email: portalUserByEmail.email,
                name: portalUserByEmail.full_name || 'Usuario',
                role: portalUserByEmail.role as 'proveedor' | 'aprobador' | 'operaciones',
                createdAt: new Date(portalUserByEmail.created_at),
                lastLogin: new Date()
              };
              setUser(userData);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login for:', email);
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      console.log('✅ Auth successful, user:', data.user?.email);
      
      if (data.user) {
        // Get additional user info from portal_users table
        console.log('🔍 Looking up portal user for ID:', data.user.id);
        const { data: portalUser } = await supabase
          .from('portal_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        console.log('🏢 Portal user lookup result:', portalUser);
        
        if (portalUser) {
          const userData: User = {
            id: portalUser.user_id,
            email: portalUser.email,
            name: portalUser.full_name || 'Usuario',
            role: portalUser.role as 'proveedor' | 'aprobador' | 'operaciones',
            createdAt: new Date(portalUser.created_at),
            lastLogin: new Date()
          };
          console.log('✅ Setting user data after login:', userData);
          setUser(userData);
          setIsLoading(false);
          return true;
        } else {
          console.error('❌ No portal user found for authenticated user ID:', data.user.id);
          
          // Try to find user by email as fallback
          const { data: portalUserByEmail } = await supabase
            .from('portal_users')
            .select('*')
            .eq('email', data.user.email)
            .single();

          if (portalUserByEmail) {
            console.log('✅ Found portal user by email after login:', portalUserByEmail);
            const userData: User = {
              id: portalUserByEmail.id,
              email: portalUserByEmail.email,
              name: portalUserByEmail.full_name || 'Usuario',
              role: portalUserByEmail.role as 'proveedor' | 'aprobador' | 'operaciones',
              createdAt: new Date(portalUserByEmail.created_at),
              lastLogin: new Date()
            };
            setUser(userData);
            setIsLoading(false);
            return true;
          }
          
          setIsLoading(false);
          return false;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      return !error;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const value = {
    user,
    isCheckingSession,
    login,
    logout,
    isLoading,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};