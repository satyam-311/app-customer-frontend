// src/context/AuthContext.js
//
// Holds the signed-in user (or null). login()/signup() call the mock
// api.login()/api.signup() facade functions - swapping in a real backend
// later means changing those two function bodies in mockData.js, not
// anything here or in the Login/Signup screens.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (identifier, password) => {
    const loggedInUser = await api.login(identifier, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const signup = useCallback(async (payload) => {
    const newUser = await api.signup(payload);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
