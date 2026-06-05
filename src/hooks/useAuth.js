import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session on mount

  // Check existing session once on mount
  useEffect(() => {
    api('/api/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async ({ email, password, name }) => {
    const { user } = await api('/api/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
    setUser(user);
    return user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { user } = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  }, []);

  return { user, loading, register, login, logout };
}
