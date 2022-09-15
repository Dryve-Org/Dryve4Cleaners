// const v = require("validator")

import { ValuesI } from "../hook/inputs"

interface Values {
    [key: string]: string
}

export const numOnly = (val: string) => val === undefined ? "" :  val.replace(/[^0-9.]/g, "")

export const validation = <T extends ValuesI>(values: T): Partial<T> => {

    let errors: ValuesI = {}

    const pe = 'Please Enter'

    const exists = (keyValue: string) => values[keyValue] !== undefined

    // username
    if(values["username"] === "") {
        errors["username"] = 'Please enter a username'
    }

    if(values['password'] === '') {
        errors['password'] = 'Please enter a password'
    }

    //return values as empty string if not updated
    return errors as Partial<T>
}