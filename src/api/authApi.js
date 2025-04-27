import { api } from "./apiConfig";

// Authentication API service
const AuthApi = {
  // Login with email and password
  login: async (userData) => {
    try {
      const response = await api.post("/api/auth/login", userData);
      if (response.data.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
      }
      return response.data;
    } catch (error) {
      return Promise.reject(error.response ? error.response.data : error.message);
    }
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response ? error.response.data : error.message);
    }
  },
  
  // Verify account with token received by email
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify-account?token=${token}`);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response ? error.response.data : error.message);
    }
  },
  
  // Logout user and remove data from storage
  logout: () => {
    localStorage.removeItem("user");
  },
  
  // Get current authenticated user information
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/update-profile", userData, {
        headers: AuthApi.authHeader()
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error.response ? error.response.data : error.message);
    }
  },
  
  // Generate authorization header with JWT token
  authHeader: () => {
    const user = AuthApi.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }
};

export default AuthApi;