import axios from "axios"
import { useNavigate } from "react-router-dom"
import { api } from "../constants/request"


const MainErrorHook = () => {
    const nav = useNavigate()

    const errorHandler = (e: any, customHandler?: (e: any) => void) => {
        customHandler && customHandler(e)
        if(axios.isAxiosError(e)) {
            console.log('status', e.response?.status)
            if(e.response?.status === 401) {
                nav('/login')
            }
        }
    }

    return {
        errorHandler
    }
}

export default MainErrorHook