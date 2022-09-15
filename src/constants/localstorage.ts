//get token from local storage
export const retreiveToken = (): string => {
    const token = localStorage.getItem('token')
    return token ? token : ''
}

//get cleanerid from local
export const retreiveClnId = (): string => {
    const cleanerid = localStorage.getItem('cleanerId')
    return cleanerid ? cleanerid : ''
}