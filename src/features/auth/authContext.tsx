'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../types/user';
import { MOCK_USER } from '../../lib/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth status
    // In production, verify token with backend
    const checkAuth = async () => {
      setIsLoading(true);
      
      // If no user in localStorage, use mock data for demo
      if (!user) {
        setUser(MOCK_USER);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    // const response = await apiClient.post('/auth/login', { email, password });
    
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(MOCK_USER);
    localStorage.setItem('auth_token', 'mock_token_123');
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}