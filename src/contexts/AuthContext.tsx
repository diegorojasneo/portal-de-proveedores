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
      if (!isSupabaseConfigured || !supabase) {
        console.log('❌ Supabase not configured - skipping session check');
        setIsCheckingSession(false);
        return;
      }

      try {
        setIsCheckingSession(true);
        console.log('🔍 Checking existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Session data:', session ? 'Found session' : 'No session');
        
        if (session?.user) {
          console.log('👤 User found in session:', session.user.email);
          // Get additional user info from portal_users table
          const { data: portalUser } = await supabase
            .from('portal_users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          console.log('📋 Portal user data:', portalUser);
          
          if (portalUser) {
            const userData: User = {
              id: portalUser.id,
              email: portalUser.email,
              name: portalUser.full_name || 'Usuario',
              role: portalUser.role as 'proveedor' | 'aprobador' | 'operaciones',
              createdAt: new Date(portalUser.created_at),
              lastLogin: new Date()
            };
            console.log('✅ Setting user data:', userData);
            setUser(userData);
          } else {
            console.log('❌ No portal user found for email:', session.user.email);
          }
        } else {
          console.log('❌ No user in session');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('👤 User signed in:', session.user.email);
            // Get additional user info from portal_users table
            const { data: portalUser } = await supabase
              .from('portal_users')
              .select('*')
              .eq('email', session.user.email)
              .single();
            
            console.log('📋 Portal user lookup result:', portalUser);
            
            if (portalUser) {
              const userData: User = {
                id: portalUser.id,
                email: portalUser.email,
                name: portalUser.full_name || 'Usuario',
                role: portalUser.role as 'proveedor' | 'aprobador' | 'operaciones',
                createdAt: new Date(portalUser.created_at),
                lastLogin: new Date()
              };
              console.log('✅ Setting user from auth change:', userData);
              setUser(userData);
            } else {
              console.log('❌ No portal user found for:', session.user.email);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) {
      console.log('❌ Supabase not configured');
      return false;
    }

    try {
      setIsLoading(true);
      console.log('🚀 Attempting login for:', email);
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log('❌ Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        // Get additional user info from portal_users table
        const { data: portalUser } = await supabase
          .from('portal_users')
          .select('*')
          .eq('email', data.user.email)
          .single();
        
        console.log('📋 Portal user data after login:', portalUser);
        
        if (portalUser) {
          const userData: User = {
            id: portalUser.id,
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
          console.log('❌ No portal user found after login for:', data.user.email);
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
    if (!supabase) return;
    
    console.log('👋 Logging out user');
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) {
      return false;
    }

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