import moment from 'moment'

export const unixToDate = (unixDate: number) => {
    const date = moment.unix(unixDate).format("MM/DD/YYYY, h:mm:ss a")
    return date
}