import { api } from "./apiConfig"

const API_ROOM_PARTNER_URL = "/api/partner/rooms";
const API_ROOM_CUSTOMER_URL = "/api/customer/rooms";

const getJwt = () => {
    return localStorage.getItem("jwt");
};

export const getRooms = async () => {
    try {
        const jwt = getJwt();
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
        const jwt = getJwt();
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
        const jwt = getJwt();
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