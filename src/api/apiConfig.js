import axios from "axios";

const API_URL = "http://localhost:8088/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json"
    }
})

// API configuration 
export const API_BASE_URL = 'http://localhost:8088'; // Adjust this to your Spring Boot server URL

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