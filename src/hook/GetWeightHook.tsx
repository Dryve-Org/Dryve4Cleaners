import { useState, useEffect } from 'react'
import { ServiceI } from '../interface/api'

export type toggleWeightPopParams = (service?: ServiceI) => void

/**
 * This hook is used to handle the weight pop up
 * 
 * @returns 
*/
const GetWeighPopHook = (
    onSubmit?: (input: number) => void
) => {
    const [ weightInput, setWeightInput ] = useState<number>(0)
    const [ weightPop, setWeightPop ] = useState<boolean>(false)
    const [ service, setService ] = useState<ServiceI | undefined>(undefined)
    
    const toggleWeightPop = (service?: ServiceI) => {
        if(service && !weightPop) {
            setWeightPop(true)
            setService(service)
        } else {
            setWeightPop(!weightPop)
        }
    }

    const handleSubmit = (input: number) => {
        setWeightInput(input)
        setWeightPop(false)
        onSubmit && onSubmit(input)
    }

    return [
        weightPop,
        toggleWeightPop,
        handleSubmit,
        service,
        weightInput
    ] as const
}

export default GetWeighPopHook;