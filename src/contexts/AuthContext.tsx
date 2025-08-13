import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  requestPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'proveedor@example.com',
    name: 'Juan Pérez',
    role: 'proveedor',
    company: 'Empresa ABC SAC',
    ruc: '20123456789',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-10')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'operaciones@neoconsulting.com',
    name: 'María González',
    role: 'operaciones',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-12-10')
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'aprobador@neoconsulting.com',
    name: 'Carlos Rodríguez',
    role: 'aprobador',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-12-10')
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('neo-user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('neo-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem('neo-user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neo-user');
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockUsers.some(u => u.email === email);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};