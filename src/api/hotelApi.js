import { api } from "./apiConfig";
import axios from 'axios';

const API_URL = 'http://localhost:8088/api/partner/hotels';

// Get all hotels with pagination
export const getHotels = async (page = 0, size = 10) => {
    try {
        const response = await api.get(`/hotels?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
    }
};

// Get hotel by ID
export const getHotelById = async (id) => {
    try {
        const response = await api.get(`/hotels/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching hotel with id ${id}:`, error);
        throw error;
    }
};

// Get featured hotels
export const getFeaturedHotels = async (limit = 6) => {
    try {
        const response = await api.get(`/hotels/featured?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching featured hotels:', error);
        throw error;
    }
};

// Search hotels
export const searchHotels = async (params) => {
    try {
        const response = await api.get('/hotels/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};

export const createHotel = async (hotelData) => {
    try {
        const token = localStorage.getItem('jwt');
        const response = await axios.post(`${API_URL}/create`, hotelData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating hotel:', error);
        throw new Error(error.response?.data || 'Failed to create hotel');
    }
}

export const updateHotelImages = async (hotelId, formData) => {
    try {
        const token = localStorage.getItem('jwt');
        const response = await axios.post(
            `${API_URL}/create/${hotelId}/images`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error(error.response?.data || 'Failed to upload images');
    }
}

export const updateHotel = async (hotelId, hotelData) => {
    try{
        const response = await api.put(`/partner/hotels/update/${hotelId}`, hotelData);
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export const deleteHotel = async (hotelId) => {
    try{
        const response = await api.delete(`/partner/hotels/delete/${hotelId}`);
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

//
export const getHotelsFromCustomer = async (page, size) => {
    try {
        const response = await api.get(`/customer/hotels?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
    }
}

// Get popular hotels in the customer side
export const getPopularHotels = async () => {
    try{
        const response = await api.get('/customer/hotels/popular');
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

// Get hotel details from the customer side
export const getHotelDetails = async (hotelId) => {
    try{
        const reponse = await api.get(`/customer/hotels/${hotelId}`);
        return reponse.data;   
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

// Get hotel details from the customer side
export const getHotelDetailsById = async (hotelId) => {
    try{
        const response = await api.get(`/customer/hotels/${hotelId}`);
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

// api form search hotel by some criteria
export const searchRoomsByCriteria = async (criteria) => {
    try{
        const response = await api.get('/customer/hotels/search-rooms', criteria);
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}