"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isEmailVerified: boolean;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | null;
  subscriptionPlan?: string;
  subscriptionCurrentPeriodEnd?: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token') || getCookie('token');
    if (token) {
      try {
        const decoded = jwtDecode(token) as User;
        setState({
          user: decoded,
          isLoading: false,
          error: null,
        });
      } catch {
        setState({
          user: null,
          isLoading: false,
          error: 'Invalid token',
        });
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    } else {
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const refreshToken = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh token');
      }

      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token) as User;
      setState({
        user: decoded,
        isLoading: false,
        error: null,
      });

      return decoded;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh token',
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string, remember: boolean = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token) as User;
      setState({
        user: decoded,
        isLoading: false,
        error: null,
      });

      return decoded;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // First, redirect to the landing page
      router.push('/');
      
      // Then perform the logout API call
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Finally, clear the local state and cookies
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to sign out',
      }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset password',
      }));
      throw error;
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    signIn,
    signOut,
    resetPassword,
    refreshToken,
  };
}

// Helper function to get cookie value
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
} 