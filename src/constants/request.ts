import axios, { AxiosError } from 'axios'
import { CleanerI, OrderI } from '../interface/api'

/**
 * This function returns an axios instance with a baseURL and a header with an Authorization key and a
 * value of a Bearer token.
 * @param {string} [providedToken] - The token that is provided to the function.
 * @returns An axios instance with a baseURL of '/' and a header of "Authorization" with a value of
 * "Bearer null"
*/
export const api = (providedToken?: string, errorHandler?: (e: any) => void ) => {
    const theApi = axios.create({
        baseURL: '/',
        headers: {
            "Authorization": `Bearer ${ providedToken ? providedToken : 'null' }`,
        }
    })

    theApi.interceptors.response.use((response) => response, (error) => {
        console.log('error:', error)
        if(axios.isAxiosError(error)) {
            errorHandler && errorHandler(error)
        }
    })

    return theApi
}

/**
 * This function returns an array of objects of type OrderI or undefined.
 * @param {string} token - string - the token that is used to authenticate the user
 * @param {string} cleanerId - string
 * @returns An array of Orders.
*/
export const retreivActiveOrders = async (
    token: string,
    cleanerId: string,
    errorHandler?: (e: any) => void
) => {
    try {
        const activeOrders = await api(token, errorHandler)
            .get<OrderI[]>(`/cleanerPro/active_orders/${ cleanerId }`)
            .then(res => res.data)

        return activeOrders
    } catch(e) {
        return undefined
    }
}

export const approveOrder = async (
    token: string,
    orderId: OrderI['_id'],
    errorHandler?: (e: any) => void
) => {
    try {
        const order = await api(token, errorHandler)
            .put<OrderI>(`/cleanerPro/order/${ orderId }/approve_dropoff`)
            .then(res => res.data)

        return order
    } catch {
        return undefined
    }
}

/**
 * It gets an order from the server, and if it fails, it returns undefined.
 * @param {string} token - string - the token that is used to authenticate the user
 * @param {string} orderId - string
 * @returns An object of type OrderI
 */
export const getOrder = async (
    token: string,
    orderId: string,
    errorHandler?: (e: any) => void
) => {
    try {
        const orderData = await api(token, errorHandler)
            .get<OrderI>(`/cleanerPro/order/${ orderId }`)
            .then(res => res.data)
            .catch(() => {
                throw 'unable to get order'
            })
        
        return orderData
    } catch(e) {
        errorHandler && errorHandler(e)
        return undefined
    }
}

export const getAttachedCleaners = async (
    token: string,
    errorHandler?: (e: any) => void
) => {
    try {
        const cleaners = await api(token, errorHandler)
        .get<CleanerI[]>('/cleanerPro/attached_cleaners')
        .then(res => {
            return res.data
        })

        return cleaners
    } catch(e) {
        return undefined
    }

}

/**
 * Getting services provide by the cleaner
 * @param {string} token - string - the token that is used to authenticate the user
 * @param {string} clnId - string - the cleaner id
 * @returns An array of services
 */
export const getServices = async (
    token: string,
    clnId: string,
    errorHandler?: (e: any) => void
) => {
    try {
        const services = await api(token, errorHandler)
            .get<CleanerI['services']>(`/cleanerPro/cleaner/${ clnId }/services`)
            .then(res => res.data)
        
        return services
    } catch(e) {
        errorHandler && errorHandler(e)
        return undefined
    }
}

export const UpdateServices = async (
    token: string,
    orderId: OrderI['_id'],
    desiredServices: OrderI['desiredServices'],
    errorHandler?: (e: any) => void
) => {
    try {
        const formattedDS = desiredServices.map(ds => ({
            service: ds.service._id,
            quantity: ds.quantity
        }))

        const update = await api(token, errorHandler)
            .put<OrderI>(
                `/cleanerPro/order/${orderId}/update_services`,
                {
                    desiredServices: formattedDS
                }
            )
            .then(res => res.data)

        return update
    } catch(e: any) {
        errorHandler && errorHandler(e)
        return e.data
    }
}

export const clothesReady = async (
    token: string,
    orderId: string,
    errorHandler?: (e: any) => void
) => {
    try {
        const update = await api(token, errorHandler)
            .put<OrderI>(
                `/cleanerPro/order/${orderId}/clothes_ready`
            )
            .then(res => res.data)

        return update
    } catch(e) {
        return undefined
    }
}