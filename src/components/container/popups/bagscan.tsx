import styled from 'styled-components'
import { OrderI } from '../../../interface/api'
import { BlockerS, ExitCntS, ExitSvgS, PopupI, WindowS } from './constants'
import { colorList } from '../../../styles/colors'
import { device } from '../../../styles/viewport'
import { QrCodeScanner } from 'react-simple-qr-code-scanner'
import { useState } from 'react'

const PopBlockerS = styled(BlockerS)``

const PopWindowS = styled(WindowS)`
    display: ${({ active }) => active ? 'block' : 'none'};
`

const HeaderCtnS = styled.div`
    font-size: 24px;
    text-align: center;
    margin: .5em 0;
`

const HeaderTxtS = styled.p`
    color: ${ colorList.a3 };
    font-weight: bolder;
`

const BodyCtnS = styled.div`
    overflow-y: auto;
    padding: 0 1em;
    max-height: 80%;
`

const QrBttnCtnS = styled.button`
    width: 100%;
    display: flex;
    align-items: 'center';
    background-color: transparent;
    outline: none;
    border: 1px solid ${ colorList.a3 };
    border-radius: 5px;
    padding: 1em 1em;
    box-shadow: inset 0px 0px 10px 1px ${ colorList.a3 };
    cursor: pointer;

    &:hover {
        filter: brightness(1.5);
        box-shadow: inset 0px 0px 15px 1px ${ colorList.a3 };
    }

    transition: all .2s ease-in-out;
    overflow: hidden;

    @media ${ device.desktop } {
        position: absolute;
        top: 0;
        left: 0;
        height: auto;
        width: auto;
        padding: 0 0;
        /* margin: 10px auto; */
        justify-self: left;
        border: none;
        box-shadow: none;
    }
`

const QRScannerS = styled(QrCodeScanner)`
    width: 100px !important;
    height: 100px !important;
`

interface BagScanPopI {
    display: boolean
    close: () => void
    loading: boolean
    handleAction: (orderId: string) => void
    activeOrders: OrderI[]
}

const BagScanPop: React.FC<BagScanPopI> = ({
    display,
    close,
    loading,
    handleAction,
    activeOrders
}) => {
    const handleScan = (data: string) => {
        const theData = JSON.parse(data)
        console.log(activeOrders)

        if(theData.email && theData.unitId) {
            const foundOrder = activeOrders.filter(order => {
                return order.client.email === theData.email && order.unitId === theData.unitId
            })

            if(foundOrder.length > 0) {
                handleAction(foundOrder[0]._id)
            } else {
                alert('Order not found')
            }
        } else {
            alert('Invalid QR Code')
        }
    }

    if(loading) return (
        <>
            <PopBlockerS active={ display }/>
            <PopWindowS active={ display } onClick={ () => close() }>
                <ExitCntS onClick={ () => close() }>
                    <ExitSvgS />
                </ExitCntS>
                <HeaderCtnS>
                    <HeaderTxtS>Bag Scan</HeaderTxtS>
                    <HeaderTxtS>Loading...</HeaderTxtS>
                </HeaderCtnS>
            </PopWindowS>
        </>
    )

    return (
        <>
            <PopBlockerS active={ display }/>
            <PopWindowS active={ display } onClick={ () => close() }>
                <ExitCntS onClick={ () => close() }>
                    <ExitSvgS />
                </ExitCntS>
                <HeaderCtnS>
                    <HeaderTxtS>Bag Scan</HeaderTxtS>
                </HeaderCtnS>
                <BodyCtnS>
                    <QrBttnCtnS>
                        <QRScannerS
                            onResult={ (res) => handleScan(res.getText()) }
                            facingMode='environment'
                        />
                    </QrBttnCtnS>
                </BodyCtnS>
            </PopWindowS>
        </>
    )
}

export default BagScanPop
