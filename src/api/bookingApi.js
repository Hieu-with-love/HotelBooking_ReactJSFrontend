import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = 'http://localhost:8088/api/customer/bookings';

export const createBooking = async (bookingData) => {
    try {
        const token = localStorage.getItem('jwt');
        const response = await axios.post(`${API_URL}/create`, bookingData, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${API_URL}/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
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
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${API_URL}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw new Error(error.response?.data || 'Failed to fetch user bookings');
    }
}; 