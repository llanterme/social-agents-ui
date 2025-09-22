'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthTokens, RegisterRequest, LoginRequest } from '@/lib/types';
import { authService } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Initializing auth...');

      // Force re-initialization from storage
      authService.reinitialize();

      // Wait for the browser to be ready and tokens to be loaded
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('AuthContext: Checking if authenticated:', authService.isAuthenticated());
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('AuthContext: User data retrieved:', userData);
          setUser(userData);
        } catch (userError) {
          console.error('Failed to get current user:', userError);
          // If getting user data fails, clear tokens
          await authService.logout();
          setUser(null);
        }
      } else {
        console.log('AuthContext: Not authenticated');
        setUser(null);
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      // Don't set error for initialization failures as user might not be logged in
      authService.logout(); // Clear any invalid tokens
      setUser(null);
    } finally {
      console.log('AuthContext: Auth initialization complete. Loading:', false);
      setIsLoading(false);
    }
  };

  const login = async (request: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('AuthContext: Starting login...');
      const tokens = await authService.login(request);
      console.log('AuthContext: Login returned tokens:', !!tokens.accessToken);

      // Wait a brief moment for the token to be stored
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('AuthContext: Getting current user...');
      const userData = await authService.getCurrentUser();
      console.log('AuthContext: User data received:', userData);
      setUser(userData);
      console.log('AuthContext: User state set');
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Login process complete');
    }
  };

  const register = async (request: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.register(request);
      // Wait a brief moment for the token to be stored
      await new Promise(resolve => setTimeout(resolve, 100));
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear user state even if logout fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('User refresh failed:', err);
      setError('Failed to refresh user data');
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}