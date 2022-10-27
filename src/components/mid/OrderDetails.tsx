import { OrderI } from "../../interface/api"
import styled from 'styled-components'
import RequestedServices from "../container/RequestedServices"
import { device } from "../../styles/viewport"
import { colors } from "../../styles/colors"

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


interface OrderDetailsI {
    order: OrderI | undefined
    back: Function
}

const OrderDetails: React.FC<OrderDetailsI> = ({
    order,
    back
}: OrderDetailsI) => {

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
                        desiredServices={
                            order.desiredServices
                        }
                    />
                </ODsBodyS>
            </>}
        </OrderDetailsS>
            
    )
}

export default OrderDetails