import { MachineI, OrderI, OrderstatusT, ServiceI } from "../../interface/api"
import styled from 'styled-components'
import RequestedServices from "../container/RequestedServices"
import { device } from "../../styles/viewport"
import { colors, colorList } from "../../styles/colors"
import EditServices from "../container/editServices/EditServices"
import { useEffect, useState } from "react"
import { approveOrder, assignMachine, clothesReady, clothesUnReady, getOrder, UpdateServices } from "../../constants/request"
import { useGlobalContext } from "../../context/global"
import { useNavigate, useOutletContext } from "react-router-dom"
import { TokenAndClnOutletI } from "../TokenAndCln"
import { findIndex } from 'lodash'
import throttle from '@jcoreio/async-throttle'
import YayONay from "../container/popups/YayONay"
import MachineList from "../container/popups/MachineList"
import useMainErrHandler from '../../hook/MainErrorHook'
import GetWeightPop from "../container/popups/GetWeightPop"
import GetWeighPopHook from "../../hook/GetWeightHook"
import AssignMachine from "../container/popups/AssignMachine"

//ODs = OrderDetails

interface OrderDetailsSI {
    open: boolean
}

const OrderDetailsS = styled.section<OrderDetailsSI>`
    position: absolute;
    z-index: 10;
    background-color: ${colors.darkGrey };
    top: 0;
    right: ${({ open }) => open ? '0' : 'calc(-100% - 3px)'};
    width: 100%;
    height: 100%;
    transition: all ease 1s;
    border-left: 3px solid ${ colors.orange };
    transition: 1s ease all;
    
    @media ${ device.desktop } {
        position: fixed;
        position: relative;
        right: initial;
        border-left: none;
        background-color: transparent;
        height: 100%;
        overflow: auto;
    }
    
`

const LoadingS = styled.div`
    position: absolute;
    display: fixed;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 99vh;
    background-color: ${ colors.black }80;
    color: ${ colors.orange };
    font-size: 28px;
    font-weight: 500;
    text-align: center;
`

const BackBttnS = styled.button`
    margin: 1em 20px;
    width: 60px;
    height: 40px;
    background-color: ${ colorList.b1 };
    font-weight: 500;
    font-size: 18px;
    color: white;
    outline: 0;
    border-radius: 10px;
    border: 2px solid ${ colorList.a3 };

    @media ${ device.desktop } {
        display: none;
    }
`

const ODsHeadCtnS = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    border: 2px solid ${ colorList.a3 };
    gap: .5em;
    /* background-color: ${ colorList.a1 }; */
    margin: 1em;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 20px;
    max-width: 600px;
    box-shadow: 0 0 10px 0 ${ colorList.a3 }80;

    @media ${ device.desktop } {
        justify-content: center;
        max-width: 100%;
        margin: 1em 1em;
        grid-template-columns: 1fr 1fr 1fr;
        max-width: 800px;
        margin: 1em auto;
    }
`

const ODsHeadPartS = styled.div`
    width: 100%;
    text-align: center;
    border-right: 2px solid ${ colorList.a3 };
`

const ODsHeadUnitIdPartS = styled(ODsHeadPartS)`
    border-right: none;

    @media ${ device.desktop } {
        border-right: 2px solid ${ colorList.a3 };
    }
`

const ODsAssignMachCtnS = styled(ODsHeadPartS)`
    grid-column-start: 1;
    grid-column-end: 3;
    border-right: none;

    @media ${ device.desktop } {
        grid-column-start: auto;
        grid-column-end: auto;
    }
`

const ActionCtnS = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;
`

const ActionBttnS = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: .5em;
    border-radius: 5px;
    background-color: transparent;
    outline: none;
    padding: 1em;
    height: 70px;
    width: 150px;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
    }
    transition: all ease .5s;
`

const ActionRmvMachBttnS = styled(ActionBttnS)`
    border: 2px solid ${ colorList.e1 };
    color: ${ colorList.e1 };
    box-shadow: 0 0 10px 0 ${ colorList.e1 }80;
    padding: 1em .25em;
`

const ActionAddMachBttnS = styled(ActionBttnS)`
    border: 2px solid ${ colorList.c1 };
    color: ${ colorList.c1 };
    box-shadow: 0 0 10px 0 ${ colorList.c1 }80;
`

const ActionBttnTxtS = styled.p`
    color: inherit;
    font-weight: bolder;
    word-break: break-word;
`

const AddWasherSvgS = styled.img.attrs({
    src: '/images/addWasher.svg'
})`
    width: 30px;
    height: 30px;
`

const OpenMachineSvgS = styled.img.attrs({
    src: '/images/openedWasher.svg'
})`
    width: 30px;
    height: 30px;
`

const ODsHeadPartClientS = styled(ODsHeadPartS)`
    border-right: 2px solid ${ colorList.a3 };
`

const ODsHeadTxtS = styled.h3`
    color: ${ colorList.w2 };
`

const ODsHeadNameS = styled.p`
    font-weight: 500;
    color: white;
`

const ODsHeadPhnS = styled.p`
    color: white;
`

const ODsBodyS = styled.div`
    
`

const BttmBttnCtnS = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
`

const UpdateBttnS = styled.button`
    padding: 1em;
    background-color: ${ colorList.a3 };
    border: 3px solid ${ colorList.a1 };
    border-radius: 10px;
    font-weight: 800;
    cursor: pointer;

    &:hover {
        background-color: transparent;
        color: ${ colorList.a3 };
    }

    transition: ease all .25s;
`

const ReadyBttnS = styled.button`
    padding: 1em;
    border-radius: 10px;
    color: ${ colors.orange };
    border: 3px solid ${ colors.orange };
    font-weight: 800;
    background-color: transparent;
    cursor: pointer;
`

const UnReadyBttnS = styled.button`
    padding: 1em;
    border-radius: 10px;
    color: ${ colors.orange };
    border: 3px solid ${ colors.orange };
    font-weight: 800;
    background-color: ${ colors.black };
    cursor: pointer;

    &:hover {
        border: 2px solid white;
    }
`

const ErrorS = styled.div``

const ErrorTxtS = styled.p`
    text-align: center;
    color: ${ colors.orange };
    font-weight: 500;
`


interface OrderDetailsI {
    orderId: OrderI['_id'] | undefined
    back: Function
    setOrderUpdate: React.Dispatch<React.SetStateAction<boolean>>
    cleaner: OrderI['cleaner'] | undefined
}

const OrderDetails: React.FC<OrderDetailsI> = ({
    orderId,
    back,
    setOrderUpdate,
    cleaner
}: OrderDetailsI) => {
    const [ order, setOrder ] = useState<OrderI>()
    const [ dServices, setDServices ] = useState<OrderI['desiredServices']>([])
    const [ orderTotal, setOrderTotal ] = useState<OrderI['orderTotal']>()
    const [ updatedSvcs, setUpdatedSvcs ] = useState<boolean>(false)
    const [ approvalPop, setApprovalPop ] = useState<boolean>(false)
    const [ assignMachinePop, setAssignMachinePop ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ popLoading, setPopLoading ] = useState<boolean>(false)
    const { token } = useOutletContext<TokenAndClnOutletI>()
    const { errorHandler } = useMainErrHandler()

    const updateWeight = (weight: number) => {
        if(!weightService) return

        const index = findIndex(dServices, {
            service: {
                _id: weightService._id
            }
        })

        if(index === -1) {
            dServices.push({
                quantity: 1,
                weight: weight,
                service: weightService,
                _id: (dServices.length + 1).toString() 
            })
        } else {
            dServices[index].weight = weight
        }

        setUpdatedSvcs(true)
        setDServices([...dServices])

        console.log(dServices)
    }


    const [
        weightPop,
        toggleWeightPop,
        setWeightInput,
        weightService,
        weightInput
    ] = GetWeighPopHook(updateWeight)

    const nav = useNavigate()

    useEffect(() => {
        let total = 0

        for(let svc of dServices) {
            const svcTotal = svc.quantity * svc.service.price
            total += svcTotal
        }

        setOrderTotal(total)
    }, [ dServices ])

    useEffect(() => {
        const validStatuses: OrderstatusT[]  = [
            'Clothes Awaiting Pricing',
            'Clothes Being Cleaned',
            'Clothes Awaiting Clean',
            'Clothes Ready'
        ]

        const getOrderThrt = throttle(getOrder, 1000)

        if(orderId) {
            setLoading(true)
            getOrderThrt(token, orderId)
                .then(res => {
                    if(!res) return

                    if(!validStatuses.includes(res.status)) {
                        alert('You can no longer edit this order')
                        nav('/dashboard')
                    }

                    setOrder(res)
                    if(res.desiredServices.length) {
                        setDServices(res?.desiredServices)
                    }

                    setApprovalPop(!res.cleanerApproved)
                })
                .finally(() => setLoading(false))
        } else {
            setOrder(undefined)
        }
    }, [ orderId ])

    if(!order && orderId) {
        return(
            <OrderDetailsS open={ order ? true : false }>
                <BackBttnS
                    onClick={() => back()}
                >
                    Back
                </BackBttnS>
                <ErrorS>
                    <ErrorTxtS>
                        Could not retrieve order
                    </ErrorTxtS>
                </ErrorS>
            </OrderDetailsS>
        )
    }

    if(!cleaner) {
        return(
            <OrderDetailsS open={ order ? true : false }>
                <BackBttnS
                    onClick={() => back()}
                >
                    Back
                </BackBttnS>
                <ErrorS>
                    <ErrorTxtS>
                        Waiting for Cleaner Information
                    </ErrorTxtS>
                </ErrorS>
            </OrderDetailsS>
        )
    }

    const handleAssignMachine = async (machineId: MachineI['machineId']): Promise<boolean> => {
        try {
            if(!orderId) return false
            setPopLoading(true)

            const order = await assignMachine(token, 
                orderId, 
                machineId, 
                (e) => console.log('this error happend', e)
            )
            if(!order) return false

            setOrder(order)
            return true
        } catch {
            alert(
                'Something went wrong. Please try again or contact a Gourmade Laudry Representative.'
            )

            return false
        } finally {
            setPopLoading(true)
        }
    }

    /**
     * This function handles the approval of an order and updates the order state.
     * @returns It is not clear what is being returned as the code snippet only shows a function
     * definition. The function `handleApproval` is defined as an asynchronous function that tries to
     * approve an order using the `approveOrder` function with the provided `token` and `orderId`. If
     * successful, it sets the `order` state with the returned order object. If there is an error, it
     * displays an alert message
    */
    const handleAproval = async () => {
        try {
            if(!orderId) return
            setPopLoading(true)
            const order = await approveOrder(token, orderId, errorHandler)
            setOrder(order)
        } catch {
            alert(
                'Something wrong. Please try again or contact a Dryve Representative.'
            )
        }
        finally {
            setApprovalPop(false)
            setOrderUpdate(true)
        }
    }

    /**
     * Adds or subtracts a service from the order
     * @param serviceId 
     * @param subtract - true if you want to subtract a service
     * @param service 
     * @returns 
    */
    const addSubSvc = (
        serviceId: string,
        subtract: boolean,
        service: ServiceI
    ) => {
        const index = findIndex(dServices, { 
            service: {
                _id: serviceId
            }
        })

        const dSvc = dServices[index]

        if(subtract && dSvc.quantity === 1) {
            dServices.splice(index, 1)

            setUpdatedSvcs(true)
            setDServices([...dServices])
            return
        }
        
        if(index === -1) {
            dServices.push({
                quantity: 1,
                service,
                _id: (dServices.length + 1).toString() 
            })

            setUpdatedSvcs(true)
            setDServices([...dServices])
            return
        }
        

        subtract ? dServices[index].quantity-- : dServices[index].quantity++

        setUpdatedSvcs(true)
        setDServices([...dServices])
    }

    /**
     * This function updates the services for an order if it has not been paid for yet.
     * @returns It depends on the conditions in the code. If either `order` or `dServices` is falsy,
     * the function will return without doing anything. If `order.orderPaidfor` is truthy, an alert
     * will be shown and the function will return. Otherwise, the function will call `UpdateServices`
     * with `token`, `order._id`, and `dServices` as arguments,
    */
    const update = () => {
        if(!order || !dServices.length) return
        if(order.orderPaidfor) {
            alert('Cannot update at this stage of the order. Please contact a Dryver assistant if this needs to be changed.')
            return
        }

        console.table(dServices)

        UpdateServices(
            token,
            order._id,
            dServices
        )
        .then(res => {
            setUpdatedSvcs(false)
        })
        .finally(() => {
            setOrderUpdate(true)
        })
    } 

    /**
     * This function handles the click event of a button to mark an order as ready and updates the
     * order status accordingly.
     * @returns It depends on the conditions in the code. If either `dServices` or `order` is falsy,
     * the function will return nothing. If `assignedMachines` has a length greater than 0, the
     * function will return nothing after displaying an alert message. Otherwise, the function will
     * call the `clothesReady` function and update the state variables `order` and `updatedSv
    */
    const handleReadyBttn = async () => {
        try {
            if(!dServices.length || !order) return
            const assignedMachines = cleaner.machines.filter(mach => {
                return mach.attachedOrder?.includes(order._id)
            })

            if(assignedMachines.length) {
                const listMachines = assignedMachines.map(mach => mach.machineId).join(', ')
                alert(`Order ${order.unitId} must be removed from machine(s) ${listMachines}`)
                return
            }

            setLoading(true)
        
            const updatedOrder = await clothesReady(
                token,
                order._id
            )
            
            if(!updatedOrder) return

            setOrder(updatedOrder)
            setUpdatedSvcs(false)
        } catch(e: any) {
            console.error(e)
        } finally {
            setLoading(false)
            setOrderUpdate(true)
        }
            
    }

    /**
     * This function handles the action of marking an order as unready for clothes.
     * @returns If the order status is not 'Clothes Ready', the function will return without doing
     * anything. If the clothesUnReady function does not return an updated order, the function will
     * also return without doing anything. Otherwise, the function will update the order state with the
     * updated order and set the orderUpdate state to true. Finally, the function will set the loading
     * state to false.
    */
    const handleUnreadyBttn = async () => {
        try {
            if(order?.status !== 'Clothes Ready') return
            setLoading(true)

            const updatedOrder = await clothesUnReady(
                token, 
                order._id, 
                errorHandler
            )

            if(!updatedOrder) return

            setOrder(updatedOrder)
        } catch(e) {
            console.log(e)
        } finally {
            setOrderUpdate(true)
            setLoading(false)
        }
    }

    if(!orderId) return <></> 

    if(!order) return (
        <OrderDetailsS open={ order ? true : false }>
            <ODsHeadTxtS>
                Unable to Retreive order
            </ODsHeadTxtS>
        </OrderDetailsS>
    )

    /*
        find machines order is assigned to
    */
    const assignedMachines = cleaner.machines.filter(mach => {
        return mach.attachedOrder?.includes(order._id)
    })

    return (
        <>
            <YayONay 
                display={ approvalPop }
                head="Do you accept this order?"
                subHead="Yes makes you liable for this order" 
                onYes={ handleAproval } 
                onNo={ () => {
                        setApprovalPop(false)
                        alert('You will not be able to edit this order unless approved.')
                    } 
                }
                loading={ popLoading }
            />
            <AssignMachine 
                display={ assignMachinePop }
                close={ () => setAssignMachinePop(false) }
                order={ order }
                machineList={ cleaner.machines }
                onSubmit={ handleAssignMachine }
            />
            <GetWeightPop
                display={ weightPop }
                close={ toggleWeightPop }
                submitWeight={ setWeightInput }
                service={ weightService }
            />
            <OrderDetailsS open={ order ? true : false }>
                {loading &&
                    <LoadingS>
                        <p>loading...</p>
                    </LoadingS>
                }
                <BackBttnS
                    onClick={() => back()}
                >
                    Back
                </BackBttnS>
                <ODsHeadCtnS>
                    <ODsHeadPartClientS>
                        <ODsHeadNameS>
                            {`${ order.client.firstName } ${ order.client.lastName }`}
                        </ODsHeadNameS>
                        <ODsHeadPhnS>
                            {`${ order.client.phoneNumber }`}
                        </ODsHeadPhnS>
                    </ODsHeadPartClientS>
                    <ODsHeadUnitIdPartS>
                        <ODsHeadNameS> Unit Id </ODsHeadNameS>
                        <ODsHeadPhnS>
                            { order.unitId }
                        </ODsHeadPhnS>
                    </ODsHeadUnitIdPartS>
                    <ODsAssignMachCtnS>
                        <ODsHeadNameS> Assigned Machines </ODsHeadNameS>
                        <ODsHeadPhnS>
                        { assignedMachines.length ? assignedMachines.map(mach => mach.machineId).join(', ') : 'None' }
                        </ODsHeadPhnS>
                    </ODsAssignMachCtnS>
                </ODsHeadCtnS>
                <ActionCtnS>
                    <ActionRmvMachBttnS>
                        <ActionBttnTxtS>Assigend Machines</ActionBttnTxtS>
                        <OpenMachineSvgS />
                    </ActionRmvMachBttnS>
                    <ActionAddMachBttnS onClick={() => setAssignMachinePop(true)}>
                        <ActionBttnTxtS>Add Machine</ActionBttnTxtS>
                        <AddWasherSvgS />
                    </ActionAddMachBttnS>
                </ActionCtnS>
                <ODsBodyS>
                    <RequestedServices 
                        desiredServices={ dServices }
                        orderTotal={ orderTotal }
                        isUpdated={ updatedSvcs }
                    />
                    { order.status !== 'Clothes Ready' &&
                        <EditServices 
                            cleaner={ cleaner }
                            addSubSvc={ addSubSvc }
                            toggleWeightPop={ toggleWeightPop }
                            key={ order._id }
                        />
                    }
                </ODsBodyS>
                <BttmBttnCtnS>
                    {
                        order.status !== 'Clothes Ready' && <UpdateBttnS onClick={() => update()}>
                            Update
                        </UpdateBttnS>
                    }
                    {
                        dServices.length && order.status === 'Clothes Being Cleaned' && !updatedSvcs ? 
                        <ReadyBttnS onClick={() => handleReadyBttn()}>
                            Ready For Pickup
                        </ReadyBttnS>
                        : null
                    }
                    {
                        order.status === 'Clothes Ready' && <UnReadyBttnS onClick={ () => handleUnreadyBttn() }>
                            Unready
                        </UnReadyBttnS>
                    }
                </BttmBttnCtnS>
            </OrderDetailsS>
        </>
    )
}

export default OrderDetails