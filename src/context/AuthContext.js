import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((email, password) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (found) {
          const { password: _, ...safeUser } = found;
          setUser(safeUser);
          setIsLoading(false);
          resolve(safeUser);
        } else {
          setIsLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
