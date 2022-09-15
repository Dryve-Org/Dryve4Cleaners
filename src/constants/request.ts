import axios from 'axios'
import { OrderI } from '../interface/api'

export const api = (providedToken?: string) => {
    return axios.create({
        baseURL: '/',
        headers: {
            "Authorization": `Bearer ${ providedToken ? providedToken : 'null' }`,
        }
    })
}

export const retreivActiveOrder = async (
    token: string,
    cleanerId: string
) => {
    try {
        const activeOrders = await api(token)
            .get<OrderI[]>(`/cleanerPro/active_orders/${ cleanerId }`)
            .then(res => res.data)

        return activeOrders
    } catch {
        return undefined
    }
} 

export const getOrder = async (
    token: string,
    orderId: string
) => {
    try {
        const orderData = await api(token)
            .get<OrderI>(`/cleanerPro/order/${ orderId }`)
            .then(res => res.data)
        
        return orderData
    } catch {
        return undefined
    }
}