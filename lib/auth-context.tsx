'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';

export type UserRole =
  | 'customer'
  | 'photographer'
  | 'studio_manager'
  | 'staff'
  | 'admin'
  | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  studioId?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ requiresVerification: boolean }>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  getDashboardPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'customer':       return '/customer';
    case 'photographer':   return '/photographer';
    case 'studio_manager':
    case 'staff':          return '/studio';
    case 'admin':
    case 'super_admin':    return '/admin';
    default:               return '/';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from stored token on mount
  useEffect(() => {
    const token = api.getToken();
    if (!token) { setIsLoading(false); return; }
    api.get<{ ok: boolean; user: User }>('/api/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => api.clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const { token, user } = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
      api.setToken(token);
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    email: string, password: string, name: string, role: UserRole, phone?: string
  ): Promise<{ requiresVerification: boolean }> => {
    setIsLoading(true);
    try {
      const { token, user, requiresVerification } = await api.post<{
        token: string; user: User; requiresVerification: boolean;
      }>('/api/auth/register', { email, password, name, role, phone });
      api.setToken(token);
      setUser(user);
      return { requiresVerification };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
  }, []);

  const verifyOTP = useCallback(async (otp: string) => {
    await api.post('/api/auth/verify-otp', { otp });
    setUser(prev => prev ? { ...prev, isVerified: true } : prev);
  }, []);

  const resendOTP = useCallback(async () => {
    await api.post('/api/auth/resend-otp', {});
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      verifyOTP,
      resendOTP,
      updateUser,
      getDashboardPath: () => getDashboardPath(user?.role ?? 'customer'),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
