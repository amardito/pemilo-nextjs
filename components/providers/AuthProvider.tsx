'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

interface AdminUser {
  id: string;
  username: string;
  max_room: number;
  max_voters: number;
  is_active: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, encryptedPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Restore token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      api.setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, encryptedPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(username, encryptedPassword);

      if (response.token && response.admin) {
        setToken(response.token);
        setUser(response.admin);
        
        // Store in localStorage
        localStorage.setItem('auth_token', response.token);
        
        // Also set as cookie for middleware to read
        document.cookie = `auth_token=${response.token}; path=/; max-age=86400`;
        
        api.setToken(response.token);
        
        // Small delay to ensure state updates before redirect
        setTimeout(() => {
          router.push('/admin');
        }, 100);
      } else {
        setError('Invalid login response from server');
        throw new Error('Invalid login response');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('auth_token');
    // Clear the auth cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
    api.clearToken();
    router.push('/admin-login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
