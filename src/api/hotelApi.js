import { api } from "./apiConfig";
import axios from 'axios';

const getJwt = () => {
    return localStorage.getItem('jwt');
} 
const API_HOTEL_PARTNER_URL = '/api/partner/hotels';
const API_HOTEL_CUSTOMER_URL = '/api/customer/hotels';

// Get all hotels with pagination
export const getHotels = async (page = 0, size = 10) => {
    try {
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_PARTNER_URL}?page=${page}&size=${size}`, {
            headers: {
                'Authorization' : `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
    }
};

// Get hotel by ID
export const getHotelById = async (id) => {
    try {
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_PARTNER_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching hotel with id ${id}:`, error);
        throw error;
    }
};

export const createHotel = async (hotelData) => {
    try {
        const jwt = getJwt();
        const response = await api.post(`${API_HOTEL_PARTNER_URL}/create`, hotelData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
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
        const jwt = getJwt();
        const response = await api.post(
            `${API_HOTEL_PARTNER_URL}/create/${hotelId}/images`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
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
        const jwt = getJwt();
        const response = await api.put(`${API_HOTEL_PARTNER_URL}/update/${hotelId}`, hotelData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
            }
        });
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export const deleteHotel = async (hotelId) => {
    try{
        const jwt = getJwt();
        const response = await api.delete(`${API_HOTEL_PARTNER_URL}/delete/${hotelId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}


// Call api for customer side

// Get featured hotels
export const getFeaturedHotels = async (limit = 6) => {
    try {
        const jwt = getJwt();
        const response = await api.get(`/hotels/featured?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching featured hotels:', error);
        throw error;
    }
};

// Search hotels
export const searchHotels = async (params) => {
    try {
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_CUSTOMER_URL}/search`, { params }, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};


//
export const getHotelsFromCustomer = async (page, size) => {
    try {
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_CUSTOMER_URL}?page=${page}&size=${size}`,{
            headers:{
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
    }
}

// Get popular hotels in the customer side
export const getPopularHotels = async () => {
    try{
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_CUSTOMER_URL}/popular`, {
            headers:{
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

// Get hotel details from the customer side
export const getHotelDetails = async (hotelId) => {
    try{
        const jwt = getJwt();
        const reponse = await api.get(`${API_HOTEL_CUSTOMER_URL}/${hotelId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return reponse.data;   
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

// Get hotel details from the customer side
export const getHotelDetailsById = async (hotelId) => {
    try{
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_CUSTOMER_URL}/${hotelId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

// api form search hotel by some criteria
export const searchRoomsByCriteria = async (criteria) => {
    try{
        const jwt = getJwt();
        const response = await api.get(`${API_HOTEL_CUSTOMER_URL}/search-rooms`, criteria, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error.message;
    }
}