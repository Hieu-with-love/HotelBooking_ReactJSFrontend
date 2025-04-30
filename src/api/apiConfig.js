import axios from "axios";

// const API_URL = "https://hotelbooking-springbackend.onrender.com";
export const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dflwowhcc/image/upload/";


export const API_URL = "http://localhost:8088"; // Adjust this to your Spring Boot server URL

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json"
    }
});

// Add response interceptor to handle 403 Forbidden responses only for partner routes
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Only redirect to NotFound if:
        // 1. We receive a 403 status code AND
        // 2. The current path starts with /partner/ AND
        // 3. User is logged in (has JWT token)
        if (error.response && error.response.status === 403) {
            const isAttemptingPartnerRoute = window.location.pathname.startsWith('/partner/');
            const hasJwtToken = localStorage.getItem('jwt');
            
            if (isAttemptingPartnerRoute && hasJwtToken) {
                window.location.href = '/not-found';
            }
            
            // Otherwise, just let the error propagate normally
        }
        return Promise.reject(error);
    }
);

// API configuration 
export const register = async (userData) => {
    try {
        const response = await api.post("/auth/signup", userData);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export const login = async (userData) => {
    try {
        const response = await api.post("/auth/login", userData);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export const verifyAccount = async (token) => {
    try {
        const response = await api.get(`/auth/verify-account?token=${token}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}