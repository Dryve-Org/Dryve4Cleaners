import React, { useState, createContext, Dispatch, SetStateAction, useEffect } from 'react';
import { retreiveClnId, retreiveToken } from '../constants/localstorage';
import { CleanerI } from '../interface/api';


export interface GlobalI {
    token: string
    cleanerId: string
    loading: boolean
}

interface contextI {
    global: GlobalI
    setGlobal?: Dispatch<SetStateAction<GlobalI>>
}

export const GlobalContext = createContext<any>({});

interface GlobalContextProps {
    children: any
}

const GlobalContextProvider = (props: GlobalContextProps) => {
    const [ global, setGlobal ] = useState<GlobalI>({
        //if token doesn't exist user should
        //have to go to login screen
        token: '',
        cleanerId: '',
        loading: true
    })

    useEffect(() => {
        const token = retreiveToken()
        const cleanerId = retreiveClnId()
        setGlobal({ 
            ...global, 
            token,
            cleanerId,
            loading: false
        })
    }, [])

    useEffect(() => {
        if(global.token) {
            localStorage.setItem('token', global.token)
        }
    }, [ global.token ])
    
    useEffect(() => {
        if(global.cleanerId) {
            localStorage.setItem('cleanerId', global.cleanerId)
        }
    }, [ global.cleanerId ])

    const passDown: contextI = { global, setGlobal }
        
    return (
        <GlobalContext.Provider value={ passDown }>
            { props.children }
        </GlobalContext.Provider>
    )
}
 
export default GlobalContextProvider

export const useGlobalContext = (): { 
    global: GlobalI, 
    setGlobal: Dispatch<SetStateAction<GlobalI>> 
} => React.useContext(GlobalContext)