import { OrderI, OrderstatusT, ServiceI } from "../../interface/api"
import styled from 'styled-components'
import RequestedServices from "../container/RequestedServices"
import { device } from "../../styles/viewport"
import { colors, colorList } from "../../styles/colors"
import EditServices from "../container/editServices/EditServices"
import { useEffect, useState } from "react"
import { approveOrder, clothesReady, clothesUnReady, getOrder, UpdateServices } from "../../constants/request"
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

//ODs = OrderDetails

interface OrderDetailsSI {
    open: boolean
}

const OrderDetailsS = styled.section<OrderDetailsSI>`
    position: fixed;
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
    display: flex;
    border: 2px solid ${ colorList.w1 };
    background-color: ${ colorList.a1 };
    margin: 1em auto;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 20px;
    max-width: 600px;
`

const ODsHeadPartS = styled.div`
    width: 100%;
    text-align: center;
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
    //machines list
    const [ machList, setMachList ] = useState<boolean>(true)
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

    const handleReadyBttn = async () => {
        try {
            if(!dServices.length || !order) return
            setLoading(true)
        
            const updatedOrder = await clothesReady(
                token,
                order._id
            )

            if(!updatedOrder) return

            setOrder(updatedOrder)
            setUpdatedSvcs(false)
        } catch(e) {
            console.error(e)
        } finally {
            setLoading(false)
            setOrderUpdate(true)
        }
            
    }

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
            <MachineList
                display={ machList }
                close={ () => setMachList(false) }
                machines={ cleaner.machines }
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
                    <ODsHeadPartS>
                        <ODsHeadTxtS> Apartment Id </ODsHeadTxtS>
                        <ODsHeadNameS>
                            { order.unitId }
                        </ODsHeadNameS>
                    </ODsHeadPartS>
                </ODsHeadCtnS>
                <ODsHeadCtnS>
                    <ODsHeadPartS>
                        <ODsHeadTxtS> Client </ODsHeadTxtS>
                        <ODsHeadNameS>
                            {`${ order.client.firstName } ${ order.client.lastName }`}
                        </ODsHeadNameS>
                        <ODsHeadPhnS>
                            {`${ order.client.phoneNumber }`}
                        </ODsHeadPhnS>
                    </ODsHeadPartS>
                    <ODsHeadPartS>
                        <ODsHeadTxtS> Driver </ODsHeadTxtS>
                        <ODsHeadNameS>
                            {`${ order.pickUpDriver.user.firstName } ${ order.pickUpDriver.user.lastName }`}
                        </ODsHeadNameS>
                        <ODsHeadPhnS>
                            {`${ order.pickUpDriver.user.phoneNumber }`}
                        </ODsHeadPhnS>
                    </ODsHeadPartS>
                </ODsHeadCtnS>
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