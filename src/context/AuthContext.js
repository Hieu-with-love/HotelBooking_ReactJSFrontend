import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthApi from '../api/authApi';

// Create authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);


  // Function to fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setCurrentUser(null);
        setLoading(false);
        return null;
      }
      
      const user = await AuthApi.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        return user;
      } else {
        setCurrentUser(null);
        return null;
      }
    } catch (err) {
      console.log("Error fetching user data:", err);
      if (err.response && err.response.status === 401) {
        // Token expired or invalid, clear local storage
        localStorage.removeItem("jwt");
        setCurrentUser(null);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize authentication state on app load
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthApi.login({ email, password });
      if ((data.status === 401 || data.status === 400)) {
        if (data.data.message.includes("verified")){
          alert("Vui lòng xác thực tài khoản của bạn trước khi đăng nhập.");
        }else {
          alert("Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.");
        }
        
      } else {
        await fetchCurrentUser(); // Fetch user data after successful login
      }

      console.log("Login data:", data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData, role = "customer") => {
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
  const logout = async () => {
    try {
      await AuthApi.logout();
    } finally {
      // Always clear user state even if API call fails
      localStorage.removeItem("jwt");
      setCurrentUser(null);
    }
  };
  
  // Role-based navigation function
  const redirectBasedOnRole = (navigate) => {
    if (!currentUser) return;
    
    if (currentUser.role === 'PARTNER') {
      navigate('/partner');
    } else if (currentUser.role === 'CUSTOMER') {
      // Default to homepage for CUSTOMER or if role is undefined
      navigate('/');
    }else if (currentUser.role === 'ADMIN') {
      navigate('/admin');
    }else {
      navigate('/'); // Default to homepage for any other role
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isVerifying,
    login,
    register,
    logout,
    verifyEmail,
    refreshUser: fetchCurrentUser, // Export the refresh function
    redirectBasedOnRole // Export the redirect function
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};