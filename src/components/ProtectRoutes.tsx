import { Component } from 'react'
import { Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { GlobalI } from '../context/global'

interface ProtectedRouteI {
    global: GlobalI
    redirectPath?: string
    children?: JSX.Element
}

const ProtectedRoutes = ({
    global,
    redirectPath = '/login',
    children,
}: ProtectedRouteI) => {
    console.log('global: ', global)
    const nav = useNavigate()
    if (!global.token) {
      nav(redirectPath)
      return <></>
    } else if(!global.cleanerId) {
        // nav('choose_cleaner')
        return <Navigate to='choose_cleaner' />
    }
  
    return (
        <>
            { children ? children : <Outlet /> }
        </>
    )
}

export default ProtectedRoutes