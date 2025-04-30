import {api} from './apiConfig'

const API_DISCOUNT_URL = '/api/partner/vouchers'

export const getDiscounts = async (page, size) => {
    try{
        const response = await api.get(`${API_DISCOUNT_URL}?page=${page}&size=${size}`);
        return response.data
    } catch (error) {
        console.error('Error fetching discounts:', error)
        throw error
    }
}

export const getDiscountById = async (discountId) => {
    try{
        const response = await api.get(`${API_DISCOUNT_URL}/${discountId}`)
        return response.data
    } catch (error) {
        console.error('Error fetching discount by ID:', error)
        throw error
    }
}

export const createDiscount = async (discountData) => {
    try{
        const response = await api.post(`${API_DISCOUNT_URL}/create`, discountData)
        return response.data
    } catch (error) {
        console.error('Error creating discount:', error)
        throw error
    }
}

export const updateDiscount = async (discountId, discountData) => {
    try{
        const response = await api.put(`${API_DISCOUNT_URL}/update/${discountId}`, discountData)
        return response.data
    } catch (error) {
        console.error('Error updating discount:', error)
        throw error
    }
}

export const deleteDiscount = async (discountId) => {
    try{
        const response = await api.delete(`${API_DISCOUNT_URL}/delete/${discountId}`)
        return response.data
    } catch (error) {
        console.error('Error deleting discount:', error)
        throw error
    }
}