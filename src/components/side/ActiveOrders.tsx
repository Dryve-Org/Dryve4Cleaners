import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { retreivActiveOrder } from '../../constants/request'
import { useGlobalContext } from '../../context/global'
import { OrderI } from '../../interface/api'
import { colors } from '../../styles/colors'
import { device } from '../../styles/viewport'

const ActiveOrdersS = styled.section`
    @media ${ device.desktop } {
        display: flex;
        flex-direction: column;
        width: 35%;
        max-width: 400px;
        height: 100vh;
        background-color: ${ colors.black };
        /* overflow: hidden; */
    }
`

const HeadS = styled.div`
    margin: 20px 0px;
`

const HeadTxtS = styled.h3`
    text-align: center;
    font-size: 30px;
    color: ${ colors.orange };
`

const CardsCtnS = styled.section`
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1em;
    height: 100%;
    padding: 5px 0px;
    margin: 0 0%;
    overflow: scroll;
    overflow-x: hidden;
    border-radius: 5px;
    @media ${ device.desktop } {
        padding: 0px 10px
    }
`

const CardS = styled.div`
    width: 100%;
    background-color: whitesmoke;
    border-radius: 20px;
    max-width: 300px;
    text-align: center;
    font-weight: 500;
    padding: 15px 0;
    border: 3px solid ${ colors.orange };

    &:hover {
        background-color: beige;
    }
`

const CardTtlS = styled.p`
    font-size: 20px;
    
`

const CardPhn = styled.p`
    font-size: 18px;
`

const CardTxtItal = styled.p`
    font-size: 18px;
    font-style: italic;
`

const OrderCards: React.FC<{odr: OrderI, action: Function}> = ({ 
    odr,
    action
}: {odr: OrderI, action: Function}) => {

    return(
        <CardS onClick={() => action()}>
            <CardTtlS>{`${odr.client.firstName} ${ odr.client.lastName }` }</CardTtlS>
            <CardPhn>{ odr.client.phoneNumber }</CardPhn>
            <CardTxtItal>{ odr.status }</CardTxtItal>
        </CardS>
    )
}

interface ActiveOrdersSideI {
    onOrderPress: (orderId: string) => void
}

const ActiveOrdersSide: React.FC<ActiveOrdersSideI> = ({
    onOrderPress
}: ActiveOrdersSideI) => {
    const [ activeOrders, setActiveOrders ] = useState<OrderI[]>([])
    const { global, setGlobal } = useGlobalContext()
    const { token, cleanerId } = global

    const getActiveOrders = async () => {
        const aO = await retreivActiveOrder(token, cleanerId)
        if(!aO) return
        setActiveOrders(aO)
    } 

    useEffect(() => {
        getActiveOrders()
    }, [])

    return(
        <ActiveOrdersS>
            <HeadS>
                <HeadTxtS>Active Orders</HeadTxtS>
            </HeadS>
            <CardsCtnS>
                {activeOrders.map(odr => <OrderCards 
                        odr={ odr }
                        action={ () => onOrderPress(odr._id) }
                    />
                )}
            </CardsCtnS>
        </ActiveOrdersS>
    )
}

export default ActiveOrdersSide