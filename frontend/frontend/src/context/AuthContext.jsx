import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const data = await api('/me', { method: 'GET' });
      setUser(data.user || null);
      return data.user || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  function logout() {
    setAuthToken(null);
    setUser(null);
  }

  const value = { user, setUser, loading, refreshUser, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
