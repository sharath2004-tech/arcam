'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'customer' | 'photographer' | 'studio_owner' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in production, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: 'customer',
        createdAt: new Date(),
      };
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        createdAt: new Date(),
      };
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock OTP verification
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    verifyOTP,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
