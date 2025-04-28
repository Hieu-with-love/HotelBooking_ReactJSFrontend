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
    localStorage.removeItem("jwt");
  },
  
  // Get current authenticated user information
  getCurrentUser: async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      
      // If no JWT token is present, there's no authenticated user
      if (!jwt) {
        return null;
      }
      
      const response = await api.get("/api/auth/current-user", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, clear it from storage
        localStorage.removeItem("jwt");
      }
      throw error;
    }
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
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      return { Authorization: `Bearer ${jwt}` };
    } else {
      return {};
    }
  }
};

export default AuthApi;