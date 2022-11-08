import { Component } from 'react'
import { Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { GlobalI } from '../context/global'

interface TokenReqI {
    global: GlobalI
    redirectPath?: string
    children?: JSX.Element
}

const TokenReq = ({
    global,
    redirectPath = '/login',
    children,
}: TokenReqI) => {
    const nav = useNavigate()
    if (!global.token) {
      nav(redirectPath)
      return <></>
    }
  
    return (
        <>
            { children ? children : <Outlet /> }
        </>
    )
}

export default TokenReq