import axios from 'axios';
import { api, API_BASE_URL } from './apiConfig';

const API_BOOKING_URL = '/api/customer/bookings';

const getJwt = () => {
    return localStorage.getItem('jwt');
}


export const createBooking = async (bookingData) => {
    try {
        const jwt = getJwt();
        const response = await api.post(`${API_BOOKING_URL}/create`, bookingData, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const getBookingById = async (bookingId) => {
    try {
        const jwt = getJwt();
        const response = await axios.get(`${API_BOOKING_URL}/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw new Error(error.response?.data || 'Failed to fetch booking');
    }
};

export const getUserBookings = async () => {
    try {
        const jwt = getJwt();
        const response = await axios.get(`${API_BOOKING_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw new Error(error.response?.data || 'Failed to fetch user bookings');
    }
}; 