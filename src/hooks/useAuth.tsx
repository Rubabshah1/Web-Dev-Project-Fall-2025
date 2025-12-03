import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

const API_BASE_URL = 'http://localhost:5001/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = localStorage.getItem('authSession');
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          setSession(parsedSession);
          setUser(parsedSession.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('authSession');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!data.success) {
        return { error: new Error(data.error) };
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign up failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        return { error: new Error(data.error) };
      }

      // Store session in localStorage
      localStorage.setItem('authSession', JSON.stringify(data));
      setSession(data);
      setUser(data.user);

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign in failed') };
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!data.success) {
        return { error: new Error(data.error) };
      }

      // Clear session
      localStorage.removeItem('authSession');
      setSession(null);
      setUser(null);

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Sign out failed') };
    }
  };

  const refreshToken = async (refreshToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!data.success) {
        return { error: new Error(data.error) };
      }

      localStorage.setItem('authSession', JSON.stringify(data));
      setSession(data);
      setUser(data.user);

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Token refresh failed') };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshToken,
  };
};
