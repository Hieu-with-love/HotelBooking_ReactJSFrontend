import { api } from "./apiConfig"

export const getRooms = async () => {
    try {
        const response = await api.get("/api/partner/rooms");
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export const getRoomById = async (roomId) => {
    try{
        const response = await api.get(`/api/partner/rooms/${roomId}`);
        return response.data;
    }catch(error) {
        return error.response ? error.response.data : error.message;
    }
}

export const getRoomDetails = async (roomId) => {
    try{
        const response = await api.get(`/api/customer/rooms/${roomId}`);
        return response.data;
    }catch(error) {
        return error.response ? error.response.data : error.message;
    }
}