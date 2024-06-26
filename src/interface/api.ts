export interface CleanerProfileI {
    _id: string
    user: string,
    attachedCleaners: string[]
    created: number
    ownerOf?: string[]
    storePaymentMethod: string
}

export type coordinatesT = [ 
    number, //latitude 
    number //longitude
]


export interface PointI {
    type: 'Point'
    coordinates: coordinatesT
}

export interface AddressI {
    _id: string
    name?: string
    street_address_line_1: string
    street_address_line_2?: string
    city: string
    state: string
    zipcode: string
    country: string
    formatted?: string
    placeId?: string
    location: PointI
    default?: boolean //is it default pickup address... for now
}

export interface ServiceI {
    _id: string
    price: number
    name: string
    description?: string
    perPound: boolean
    productId: string
}

export type QuantityT = {
    quantity: number
}

export type ServiceRequestsI = ServiceI & {
    quantity: number
}

export interface CleanerI {
    _id: string
    name: string
    email: string
    phoneNumber: string
    website?: string
    address: AddressI
    services: ServiceI[]
    preferred?: boolean
    minPriceServiceId: string | ServiceI
    minPrice: number
    machines: MachineI[]
}

export interface MachineI {
    type: 'dryer' | 'washer'
    attachedOrder: string | null
    attachedUnitId: string | null
    lastUpdated: number,
    size: 'small' | 'medium' | 'large'
    status: 'Available' | 'In Use' | 'Out of Order'
    machineId: string
}

export type OrderstatusT = "Task Posted Pickup" |
    "Task Posted Dropoff" |
    "Picked Up From Cleaner" |
    "Task Canceled" |
    "Pickup Driver On the Way" |
    "Dropoff Driver On the Way" |
    "Clothes To Cleaner" |
    "Clothes Awaiting Pricing" |
    "Clothes Awaiting Clean" |
    "Clothes Being Cleaned" |
    "Clothes Ready" |
    "Driver To Cleaner" |
    "Clothes to Home" |
    "Complete" |
    "Cancelled"

export const orderStatuses: OrderstatusT[] = [
    "Task Posted Pickup",
    "Task Posted Dropoff",
    "Task Canceled",
    "Pickup Driver On the Way",
    "Dropoff Driver On the Way",
    "Clothes To Cleaner",
    "Clothes Awaiting Pricing",
    "Clothes Awaiting Clean",
    "Clothes Being Cleaned",
    "Clothes Ready",
    "Driver To Cleaner",
    "Picked Up From Cleaner",
    "Clothes to Home",
    "Complete",
    "Cancelled"
]

export type desiredService = {
    quantity: number
    weight?: number
    service: ServiceI //stored prices of each service and change to string
    _id: string
}

export interface OrderI {
    _id: string
    unitId: string
    aptName: string
    building: string
    unit: string
    client: {
        firstName: string
        lastName: string
        phoneNumber: string   
        email: string
    }// client
    origin?: string // client pickup and dropoff
    dropOffAddress?: string
    cleanerAddress: string
    driverLocation?: PointI
    // locationSession?: string //long and lat of clothes location
    /**
     * @Interface DriverI
     * 
     * pickUpDriver is the driver that picks up clothes from client
     */
    pickUpDriver: {
        '_id': string
        user: {
            firstName: string
            lastName: string
            phoneNumber: string
        }
    }
    dropOffDriver?: string
    pickUpCostId?: string // cost for drive to Cleaners
    dropOffCostId?: string // cost for drive from Cleaner to origin
    cleanCostId?: string // total cost for cleaners
    cleaner: CleanerI
    orderClosed: boolean //is order accessible, useable, and still active
    clientPickupTime?: number
    cleanerDropOffTime?: number
    cleanFinishTime?: number
    cleanerPickupTime?: number
    clientDropoffTime?: number
    dropoffPostedTime?: number
    toCleanerDistance: number // in miles
    fromCleanerDistance: number //in miles
    created: number
    orderPaidfor: boolean
    status: OrderstatusT
    orderFee: number
    orderFeePaid: boolean
    userCard: string
    isDropOff: boolean //is order a drop off request
    desiredServices: desiredService[]
    createdBy: {
        userType: string
        userTypeId: string
    }
    serviceCost?: number
    orderTotal?: number
    cleanerApproved: boolean
}