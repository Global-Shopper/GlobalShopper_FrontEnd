import axios from "axios"
const trackingMoreApiKey = import.meta.env.VITE_TRACKINGMORE_APIKEY

export const createTracking = (data) => {
    return axios.post('https://api.trackingmore.com/v4/trackings/create', data, {
        headers: {
            'Content-Type': 'application/json',
            'Tracking-Api-Key': trackingMoreApiKey
        }
    })
}

export const getTracking = (tracking_number) => {
    return axios.get(`https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${tracking_number}`, {
        headers: {
            'Content-Type': 'application/json',
            'Tracking-Api-Key': trackingMoreApiKey
        }
    })
}

export const getAllCouriers = () => {
    return axios.get('https://api.trackingmore.com/v4/couriers/all', {
        headers: {
            'Content-Type': 'application/json',
            'Tracking-Api-Key': trackingMoreApiKey
        }
    })
}
