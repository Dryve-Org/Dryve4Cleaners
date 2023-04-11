import moment from 'moment'

export const unixToDate = (unixDate: number) => {
    return moment.unix(unixDate).format("MM/DD/YYYY, h:mm a")
}