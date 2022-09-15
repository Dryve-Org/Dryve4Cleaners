import { useState, useEffect } from 'react'
import { validation } from '../constants/validation'


export interface ValuesI {
    [key: string]: string
}

const InputsHook = <T extends ValuesI>(inputs: T, submit: Function) => {
    const [ values, setValues ] = useState<T>(inputs)
    const [ errors, setErrors ] = useState<Partial<T>>({})
    const [ submited, setSubmited ] = useState<boolean>(false)

    const handleChange = (input: keyof T, value: string) => {
        setValues({
            ...values,
            [input]: value
        })
    }

    const handleSubmit = (e: Event) =>{
        e.preventDefault()
        setErrors(validation<T>(values))
        setSubmited(true)
    }


    useEffect(() => {
        if(!Object.keys(errors).length && submited){
            submit(values)
        }
    }, [ errors ])

    return({
        values,
        handleChange,
        handleSubmit,
        errors
    })
}

export default InputsHook