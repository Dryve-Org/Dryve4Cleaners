import { Navigate, useNavigate } from "react-router-dom"

interface ProtectedRouteI {
    token: string
    children: JSX.Element
    redirect?: string
}

const ProtectedRoute = ({ 
    token, 
    children,
    redirect = '/login'
}: ProtectedRouteI) => {
    const nav = useNavigate()
    if (!token) {
        nav(redirect)
    }

    return children
}

export default ProtectedRoute