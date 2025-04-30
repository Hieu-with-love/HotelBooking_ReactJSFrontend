import { api } from "./apiConfig"

const jwt = localStorage.getItem("jwt");
const API_ROOM_PARTNER_URL = "/api/partner/rooms";
const API_ROOM_CUSTOMER_URL = "/api/customer/rooms";

export const getRooms = async () => {
    try {
        const response = await api.get(`${API_ROOM_PARTNER_URL}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export const getRoomById = async (roomId) => {
    try{
        const response = await api.get(`${API_ROOM_PARTNER_URL}/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    }catch(error) {
        return error.response ? error.response.data : error.message;
    }
}


// Call api for customer side

export const getRoomDetails = async (roomId) => {
    try{
        const response = await api.get(`${API_ROOM_CUSTOMER_URL}/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        return response.data;
    }catch(error) {
        return error.response ? error.response.data : error.message;
    }
}