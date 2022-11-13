import { Component } from 'react'
import { Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { GlobalI } from '../context/global'

interface TokenAndClnI {
    global: GlobalI
    redirectPath?: string
    children?: JSX.Element
}

export interface TokenAndClnOutletI {
    token: string
    cleanerId: string
}

const TokenAndCln = ({
    global,
    redirectPath = '/login',
}: TokenAndClnI) => {
    const { token, cleanerId } = global
    
    if (token === '') {
      return <Navigate to={ redirectPath } />
    } else if(cleanerId === '') {
        // nav('choose_cleaner')
        return <Navigate to='choose_cleaner' />
    }
  
    return (
        <Outlet context={{ token, cleanerId }}/>
    )
}

export default TokenAndCln