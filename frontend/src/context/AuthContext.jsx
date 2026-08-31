import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rental_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rental_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('rental_token');
      if (savedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('rental_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res?.data) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('rental_token', jwtToken);
      localStorage.setItem('rental_user', JSON.stringify(userData));
      return userData;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res?.data) {
      const { token: jwtToken, user: newUser } = res.data;
      setToken(jwtToken);
      setUser(newUser);
      localStorage.setItem('rental_token', jwtToken);
      localStorage.setItem('rental_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rental_token');
    localStorage.removeItem('rental_user');
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    isPartner: user?.role === 'PARTNER',
    isCustomer: user?.role === 'USER',
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
