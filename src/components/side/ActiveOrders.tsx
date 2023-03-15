import throttle from '@jcoreio/async-throttle'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { retreivActiveOrders } from '../../constants/request'
import { useGlobalContext } from '../../context/global'
import useMainErrHandler from '../../hook/MainErrorHook'
import { OrderI } from '../../interface/api'
import { colorList } from '../../styles/colors'
import { device } from '../../styles/viewport'
import { TokenAndClnOutletI } from '../TokenAndCln'

const ActiveOrdersS = styled.section`
    overflow: auto;
    @media ${ device.desktop } {
        display: flex;
        flex-direction: column;
        width: 35%;
        max-width: 300px;
        height: calc(100vh - 60px);
        /* background-color: ${ colorList.a1 }; */
        /* overflow: hidden; */
        /* box-shadow: inset 0px 0px 10px 1px ${ colorList.w3 }; */
    }
`

const HeadS = styled.div`
    margin: 20px 0px;
`

const HeadTxtS = styled.h3`
    text-align: center;
    font-size: 1.5em;
    color: ${ colorList.a3 };
`

const SubHeadTxtS = styled(HeadTxtS)`
    font-size: 1em;
    color: ${ colorList.w1 };
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

const CardS = styled.div<{status: OrderI['status']}>`
    width: 100%;
    /* background-color: ${ colorList.a3 }; */
    background-color: transparent;
    color: ${ colorList.a3 };
    border-radius: 20px;
    max-width: 250px;
    word-wrap: break-word;
    text-align: center;
    font-weight: 500;
    padding: 10px 0;
    cursor: pointer;
    border: 2px solid ${ 
        ({ status }) => {
            if(status === 'Clothes Awaiting Pricing') return colorList.w1
            if(status === 'Clothes Being Cleaned') return colorList.a1
            if(status === 'Clothes Ready') return colorList.c1
        }
    };
    box-shadow: inset 0px 0px 20px 2px ${ 
        ({ status }) => {
            if(status === 'Clothes Awaiting Pricing') return colorList.w1
            if(status === 'Clothes Being Cleaned') return colorList.a1
            if(status === 'Clothes Ready') return colorList.c1
        }
    };

    &:hover {
        border: 1px solid ${ 
            ({ status }) => {
                if(status === 'Clothes Awaiting Pricing') return colorList.w1
                if(status === 'Clothes Being Cleaned') return colorList.a1
                if(status === 'Clothes Ready') return colorList.c1
            }
        };
        box-shadow: none;
    }

    transition: all 0.3s ease-in-out;
`

const HighlightS = styled.span`
    color: ${ colorList.c1 };
`

const CardTtlS = styled.p`
    font-size: 1.2em;
`

const CardPhn = styled.p`
    font-size: 1em;
`

const CardTxtItal = styled.p`
    font-size: 1em;
    font-style: italic;
`

const OrderCards: React.FC<{odr: OrderI, action: Function}> = ({ 
    odr,
    action
}: {odr: OrderI, action: Function}) => {

    return(
        <CardS onClick={() => action()} status={ odr.status }>
            <CardTtlS>{`${odr.client.firstName} ${ odr.client.lastName }` }</CardTtlS>
            <CardTxtItal>Building: <HighlightS>{odr.building}</HighlightS></CardTxtItal>
            <CardTxtItal>Unit: <HighlightS>{odr.unit}</HighlightS></CardTxtItal>
            <CardTxtItal><HighlightS>{ odr.status }</HighlightS></CardTxtItal>
        </CardS>
    )
}

interface ActiveOrdersSideI {
    onOrderPress: (orderId: string) => void
    orderUpdate: boolean
    setOrderUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const ActiveOrdersSide: React.FC<ActiveOrdersSideI> = ({
    onOrderPress,
    orderUpdate,
    setOrderUpdate
}: ActiveOrdersSideI) => {
    const [ activeOrders, setActiveOrders ] = useState<OrderI[]>([])
    const [ loading, setLoading ] = useState<boolean>(true)
    const { errorHandler } = useMainErrHandler()

    const {
        token,
        cleanerId
    } = useOutletContext<TokenAndClnOutletI>()

    const getActiveOrders = async () => {
        try {
            const aO = await retreivActiveOrders(token, cleanerId, errorHandler)
            if(!aO) return
            setActiveOrders(aO)
        } finally {
            setLoading(false)
            setOrderUpdate(false)
        }
    }

    const getActiveOrdersThrt = throttle(getActiveOrders, 100)

    useEffect(() => {
        getActiveOrdersThrt()
    }, [])

    useEffect(() => {
        if(orderUpdate) {
            getActiveOrdersThrt()
        }
    }, [ orderUpdate ])

    if(loading) {
        return (
            <ActiveOrdersS>
                <HeadS>
                    <HeadTxtS>Active Orders</HeadTxtS>
                    <SubHeadTxtS>Loading...</SubHeadTxtS>
                </HeadS>
            </ActiveOrdersS>
        )
    }

    return(
        <ActiveOrdersS>
            <HeadS>
                <HeadTxtS>Active Orders</HeadTxtS>
                {!activeOrders.length && <SubHeadTxtS>No Orders</SubHeadTxtS>}
            </HeadS>
            <CardsCtnS>
                {activeOrders.map(odr => 
                    <OrderCards 
                        odr={ odr }
                        action={ () => onOrderPress(odr._id) }
                    />
                )}
            </CardsCtnS>
        </ActiveOrdersS>
    )
}

export default ActiveOrdersSide