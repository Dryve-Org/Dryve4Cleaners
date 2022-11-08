import { OrderI, ServiceI } from "../../interface/api"
import styled from 'styled-components'
import RequestedServices from "../container/RequestedServices"
import { device } from "../../styles/viewport"
import { colors } from "../../styles/colors"
import EditServices from "../container/EditServices"
import { useEffect, useState } from "react"
import { clothesReady, getOrder, UpdateServices } from "../../constants/request"
import { useGlobalContext } from "../../context/global"
import { useOutletContext } from "react-router-dom"
import { TokenAndClnOutletI } from "../TokenAndCln"
import _ from 'lodash'

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

    @media ${ device.desktop } {
        border-left: none;
        position: initial;
        background-color: transparent;
    }
`

const BackBttnS = styled.button`
    margin: 1em 20px;
    width: 60px;
    height: 40px;
    background-color: ${ colors.black };
    font-weight: 500;
    font-size: 18px;
    color: white;
    outline: 0;
    border-radius: 10px;
    border: 2px solid ${ colors.orange };

    @media ${ device.desktop } {
        display: none;
    }
`

const ODsHeadCtnS = styled.div`
    display: flex;
    border-bottom: 2px solid black;
`

const ODsHeadPartS = styled.div`
    width: 100%;
    text-align: center;
`

const ODsHeadTxtS = styled.h3`
    color: ${ colors.orange };
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
    background-color: ${ colors.orange };
    border: 3px solid ${ colors.orange };
    border-radius: 10px;
    font-weight: 800;
`

const ReadyBttnS = styled.button`
    padding: 1em;
    border-radius: 10px;
    color: ${ colors.orange };
    border: 3px solid ${ colors.orange };
    font-weight: 800;
    background-color: transparent;

    &:hover {
        cursor: pointer;
    }
`

const ErrorS = styled.div`
    
`

const ErrorTxtS = styled.p`
    text-align: center;
    color: ${ colors.orange };
    font-weight: 500;
`


interface OrderDetailsI {
    orderId: OrderI['_id'] | undefined
    back: Function
}

const OrderDetails: React.FC<OrderDetailsI> = ({
    orderId,
    back,
}: OrderDetailsI) => {
    const [ order, setOrder ] = useState<OrderI>()
    const [ dServices, setDServices ] = useState<OrderI['desiredServices']>([])
    const [ orderTotal, setOrderTotal ] = useState<OrderI['orderTotal']>()
    const [ updatedSvcs, setUpdatedSvcs ] = useState<boolean>(false)
    const { token } = useOutletContext<TokenAndClnOutletI>()

    useEffect(() => {
        let total = 0

        for(let svc of dServices) {
            const svcTotal = svc.quantity * svc.service.price
            total+= svcTotal
        }

        setOrderTotal(total)
    }, [ dServices ])

    useEffect(() => {
        if(orderId) {
            getOrder(token, orderId)
                .then(res => {
                    if(!res) return
                    setOrder(res)
                    if(res.desiredServices.length) {
                        setDServices(res?.desiredServices)
                    }
                })
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

    const addSubSvc = (
        serviceId: string,
        subtract: boolean,
        service: ServiceI
    ) => {
        const index = _.findIndex(dServices, { 
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
                _id: ''
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

        UpdateServices(
            token,
            order._id,
            dServices
        )
        .then(res => {
            console.log('success', res)
            setUpdatedSvcs(false)
        })
    }

    const handleReadyBttn = () => {
        if(!dServices.length || !order) return

        clothesReady(
            token,
            order._id
        ).then(res => {
            setUpdatedSvcs(false)
            if(res) {
                setOrder(res)
            }
        })
    }

    return (
        <OrderDetailsS open={ order ? true : false }>
            <BackBttnS
                onClick={() => back()}
            >
                Back
            </BackBttnS>
            { order && <>
                <ODsHeadCtnS>
                    <ODsHeadPartS>
                        <ODsHeadTxtS>
                            Client
                        </ODsHeadTxtS>
                        <ODsHeadNameS>
                            {`${ order.client.firstName } ${ order.client.lastName }`}
                        </ODsHeadNameS>
                        <ODsHeadPhnS>
                            {`${ order.client.phoneNumber }`}
                        </ODsHeadPhnS>
                    </ODsHeadPartS>
                    <ODsHeadPartS>
                        <ODsHeadTxtS>
                            Driver
                        </ODsHeadTxtS>
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
                    <EditServices 
                        clnId={ order.cleaner._id }
                        addSubSvc={ addSubSvc }
                    />
                </ODsBodyS>
            </>}
            <BttmBttnCtnS>
                {
                    updatedSvcs && <UpdateBttnS onClick={() => update()}>
                        Update
                    </UpdateBttnS>
                }
                {
                    dServices.length && order?.status === 'Clothes Being Cleaned' && !updatedSvcs ? 
                    <ReadyBttnS onClick={() => handleReadyBttn()}>
                        Ready For Pickup
                    </ReadyBttnS>
                    : null
                }
            </BttmBttnCtnS>
        </OrderDetailsS>
    )
}

export default OrderDetails