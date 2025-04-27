import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthApi from '../api/authApi';

// Create authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const user = AuthApi.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthApi.login({ email, password });
      setCurrentUser(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthApi.register(userData);
      setIsVerifying(true);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email function
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthApi.verifyEmail(token);
      setIsVerifying(false);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to verify email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    AuthApi.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    isVerifying,
    login,
    register,
    logout,
    verifyEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};