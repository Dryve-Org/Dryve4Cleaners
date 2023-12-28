import throttle from '@jcoreio/async-throttle'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { retreivActiveOrders } from '../../constants/request'
import useMainErrHandler from '../../hook/MainErrorHook'
import { CleanerI, OrderI } from '../../interface/api'
import { colorList } from '../../styles/colors'
import { device } from '../../styles/viewport'
import MachineList from '../container/popups/MachineList'
import { TokenAndClnOutletI } from '../TokenAndCln'
import BagScanPop from '../container/popups/bagscan'

const ActiveOrdersS = styled.section`
    position: relative;
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

const WasherSvgCtnS = styled.button`
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
`

const BagScanSvgCtnS = styled.button`
    display: block;
    position: absolute;
    top: 20px;
    left: 20px;
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
`

export const WasherSvgS = styled.img.attrs({
    src: '/images/washer.svg'
})`
    width: 40px;
    height: 40px;
`

export const BagScanSvgS = styled.img.attrs({
    src: '/images/qr-code.svg'
})`
    width: 40px;
    height: 40px;
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
    height: calc(69vh - 200px);
    padding: 5px 0px;
    margin: 0 0%;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 5px;
    @media ${ device.desktop } {
        padding: 0px 10px
    }

    @media ${ device.desktop } {
        height: auto;
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
            <CardTtlS>{`${ odr.client.firstName } ${ odr.client.lastName }` }</CardTtlS>
            {/* <CardTxtItal>Building: <HighlightS>{odr.building}</HighlightS></CardTxtItal>
            <CardTxtItal>Unit: <HighlightS>{odr.unit}</HighlightS></CardTxtItal> */}
            <CardTxtItal>Unit Id: <HighlightS>{odr.unitId}</HighlightS></CardTxtItal>
            <CardTxtItal><HighlightS>{ odr.status }</HighlightS></CardTxtItal>
        </CardS>
    )
}

interface ActiveOrdersSideI {
    onOrderPress: (orderId: string) => void
    orderUpdate: boolean
    setOrderUpdate: React.Dispatch<React.SetStateAction<boolean>>
    cleaner: CleanerI | undefined
}

const ActiveOrdersSide: React.FC<ActiveOrdersSideI> = ({
    onOrderPress,
    orderUpdate,
    setOrderUpdate,
    cleaner
}: ActiveOrdersSideI) => {
    const [ activeOrders, setActiveOrders ] = useState<OrderI[]>([])
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ machList, setMachList ] = useState<boolean>(false && cleaner)
    const [ bagScan, setBagScan ] = useState<boolean>(false)
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

    const onBagScan = (orderId: string) => {
        onOrderPress(orderId)
        setBagScan(false)
    }

    return(
        <>
            {cleaner && <MachineList
                display={ machList }
                close={ () => setMachList(false) }
                machines={ cleaner?.machines }
            />}
            {bagScan && <BagScanPop 
                activeOrders={activeOrders}
                display={ bagScan }
                close={ () => setBagScan(false) }
                loading={ loading }
                handleAction={ (orderId: string) => onBagScan(orderId)}
            />}
            <ActiveOrdersS>
                <WasherSvgCtnS onClick={ () => setMachList(!machList) }>
                    <WasherSvgS />
                </WasherSvgCtnS>
                <BagScanSvgCtnS onClick={ () => setBagScan(!bagScan)}>
                    <BagScanSvgS />
                </BagScanSvgCtnS>
                <HeadS>
                    <HeadTxtS>Active Orders</HeadTxtS>
                    {!activeOrders.length && <SubHeadTxtS>No Orders</SubHeadTxtS>}
                </HeadS>
                <CardsCtnS>
                    {activeOrders.map(odr =>
                        <OrderCards 
                            odr={ odr }
                            action={ () => onOrderPress(odr._id) }
                            key={ odr._id }
                        />
                    )}
                </CardsCtnS>
            </ActiveOrdersS>
        </>
    )
}

export default ActiveOrdersSide