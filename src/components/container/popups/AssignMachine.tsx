import { useState } from 'react'
import { QrCodeScanner } from 'react-simple-qr-code-scanner'
import styled from 'styled-components'
import { MachineI, OrderI } from '../../../interface/api'
import { colorList } from '../../../styles/colors'
import { device } from '../../../styles/viewport'
import { BlockerS, ExitCntS, ExitSvgS, PopupI, WindowS } from './constants'

const PopBlockerS = styled(BlockerS)``

const PopWindowS = styled(WindowS)`
    display: ${({ active }) => active ? 'block' : 'none'};
    overflow-x: auto;

    &::-webkit-scrollbar {
        width: 1px;
    }

    @media ${ device.desktop } {
        height: 450px;
    }
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

const HeaderUnitIdTxtS = styled(HeaderTxtS)`
    font-size: 20px;
    font-weight: bolder;
    color: ${ colorList.w2 };
`

const BodyCtnS = styled.div`
    margin: 0 1em;
    display: flex;
    flex-direction: column;
    // height: max-content;
    gap: 1em;
    overflow-y: auto;

    @media ${ device.desktop } {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 2fr 1fr;
        align-items: center;
        gap: 1em;
        overflow-x: auto;
    }
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
    
const QrSvgS = styled.img.attrs({
    src: '/images/qr-code.svg',
})`
    width: 60px;
    height: 60px;
    margin: 0 auto;

    @media ${ device.desktop } {
        width: 40px;
        height: 40px;
    }
`

const QRScannerS = styled(QrCodeScanner)`
    width: 100px !important;
    height: 100px !important;
`

const InputCtnS = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
`

const MachineInputLabelS = styled.label`
    font-size: 20px;
    color: ${ colorList.a3 };
    font-weight: bolder;
`

const MachineInputS = styled.input`
    width: 180px;
    height: 40px;
    font-size: 20px;
    padding: 0;
    text-align: center;

    @media ${ device.desktop } {
        background-color: transparent;
        border: none;
        color: ${ colorList.w1 };
    }
`

const MichineSelectCtnS = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-around;
    gap: 1em;
    margin-bottom: 1em;

    @media ${ device.desktop } {
        /* grid-column-start: 1;
        grid-column-end: 3; */
        margin-bottom: 0s;
    }
`

const IdSelectCtnS = styled.div`
    border: 4px solid black;
    border-radius: 5px;
    display: grid;
    height: 10rem;
    padding: 5px 1px;
    grid-template-columns: 1fr 1fr 1fr;
    /* justify-content: space-around; */
    gap: 1em;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 1px;
    }

    @media ${ device.desktop } {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        min-height: 100px;
        max-height: 150px;
    }
`

const SelBoxS = styled.button`
    cursor: pointer;
    width: 99%;
    height: 150%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: transparent;
    outline: none;
    border-radius: 5px;
    padding: 1em 1em;
    border: 1px solid ${ colorList.a3 };
    box-shadow: inset 0px 0px 10px 1px ${ colorList.a3 };

    &:hover {
        filter: brightness(1.5);
        box-shadow: inset 0px 0px 15px 1px ${ colorList.a3 };
    }
`

const SelMachBoxS = styled(SelBoxS)<{ active: boolean }>`
    @media ${ device.desktop } {
        height: 50px;
        border: none;
        box-shadow: none;

        ${ ({ active }) => active && `
            border: 1px solid ${ colorList.a3 };
            box-shadow: inset 0px 0px 10px 1px ${ colorList.a3 };
        `}

        &:hover {
            filter: brightness(1.5);
            box-shadow: none;
            border: 1px solid ${ colorList.a3 };
        }
    }
`

const SelIdBoxS = styled(SelBoxS)`
    height: 50px;

    @media ${ device.desktop } {
        height: 50px;
    }
`

const SelBoxTxtS = styled.p`
    font-size: 20px;
    color: ${ colorList.c1 };
    font-weight: bolder;
`

const FooterCtnS = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 1em;
    border-radius: 5px;
    padding: 1em 1em;

    @media ${ device.desktop } {
        grid-column-start: 1;
        grid-column-end: 3;
        justify-content: space-evenly;
    }
`

const FootBttnS = styled.button`
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    padding: 1em 1.5em;
    border-radius: 5px;

    &:hover {
        filter: brightness(1.3);
    }

    transition: all 0.3s ease-in-out;
`

const CancelBttnS = styled(FootBttnS)`
    border: 1px solid ${ colorList.e1 };
    box-shadow: inset 0px 0px 10px 1px ${ colorList.e1 };
    color: ${ colorList.e1 };
`

const SubmitBttnS = styled(FootBttnS)`
    border: 1px solid ${ colorList.a3 };
    box-shadow: inset 0px 0px 10px 1px ${ colorList.a3 };
    color: ${ colorList.a3 };
`

const BttnTxtS = styled.p`
    font-size: 20px;
    color: inherit;
`



interface AssignMachineI extends PopupI {
    close: () => void
    order: OrderI
    machineList: MachineI[],
    onSubmit: (machine: MachineI['machineId']) => Promise<boolean>
}

const AssignMachine: React.FC<AssignMachineI> = ({
    display,
    close,
    order,
    machineList,
    onSubmit
}) => {
    const [ machineInput, setMachineInput ] = useState<string>('')
    const [ filteredMachineList, setFilteredMachineList ] = useState<MachineI[]>(machineList)
    const [ qrReader, setQrReader ] = useState<boolean>(false)

    const isMachineId = (id: string): boolean => {
        const foundMach = machineList.find(machine => machine.machineId === id)
        return foundMach ? true : false
    }

    const handleMachineInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target
        setMachineInput(value)
        if(value.length > 0) {
            setFilteredMachineList(
                machineList.filter(machine => (
                    machine.machineId.toLowerCase().includes(value.toLowerCase()) &&
                    machine.status === 'Available'
                ))
            )
        } else {
            setFilteredMachineList(machineList)
        }
    }

    const handleScan = (data: string): void => {
        let { machineId, cleanerId } = JSON.parse(data)
        console.log('data:', JSON.parse(data))
        machineId = machineId.replace(/\s/g, '')
        cleanerId = cleanerId.replace(/\s/g, '')


        console.log('machineId:', machineId)
        console.log('cleanerIdQR:', cleanerId)
        if(!machineId || cleanerId !== order.cleaner._id) {
            alert('Machine not found')
            setQrReader(false)
        } else {
            setMachineInput(machineId)
            setFilteredMachineList([
                machineList.find(machine => machine.machineId === machineId) as MachineI
            ])
            setQrReader(false)
        }
    }

    const machineTypeSel = (type: MachineI['type']): void => {
        switch (type) {
            case 'washer':
                setMachineInput('W-')
                setFilteredMachineList(
                    machineList.filter(machine => (
                        machine.type === 'washer' && machine.status === 'Available'
                    ))
                )
                break;
            case 'dryer':
                setMachineInput('D-')
                setFilteredMachineList(
                    machineList.filter(machine => (
                        machine.type === 'dryer' && machine.status === 'Available'
                    ))
                )
                break;
        }
    }

    const handleSubmit = async () => {
        if(machineInput.length < 2) {
            alert('Please enter a machine ID')
            return
        }
        if(!isMachineId(machineInput)) {
            alert('Machine not found')
        }

        const isSuccess = await onSubmit(machineInput)

        if(isSuccess) {
            close()
            setMachineInput(machineInput.split('-')[0] + '-')
            setFilteredMachineList(
                machineList.filter(machine => (
                    machine.type === 'dryer' && machine.status === 'Available'
                ))
            )
        }
    }


    return (
        <>
            <PopBlockerS active={ display }/>
            <PopWindowS active={ display }>
                <ExitCntS>
                    <ExitSvgS onClick={ () => close() }/>
                </ExitCntS>
                <HeaderCtnS>
                    <HeaderTxtS>Assign Machine</HeaderTxtS>
                    <HeaderUnitIdTxtS>{ order.unitId }</HeaderUnitIdTxtS>
                </HeaderCtnS>
                <BodyCtnS>
                    <InputCtnS>
                        <MachineInputLabelS htmlFor="machineInput">Machine ID</MachineInputLabelS>
                        <MachineInputS
                            type="input"
                            value={ machineInput }
                            onChange={ e => handleMachineInput(e) }
                            id="machineInput"
                            placeholder='Ex. W-01'
                            maxLength={ 5 }
                        />
                    </InputCtnS>
                    <QrBttnCtnS onClick={() => setQrReader(!qrReader)}>
                        { qrReader ? <QRScannerS
                            onResult={ (res) => handleScan(res.getText()) }
                            facingMode='environment'
                            /> :
                            <QrSvgS />
                        }
                    </QrBttnCtnS>
                    <MichineSelectCtnS>
                        <SelMachBoxS onClick={ () => machineTypeSel('washer') } active={ machineInput[0] === 'W' }>
                            <SelBoxTxtS>WASHER</SelBoxTxtS>
                        </SelMachBoxS>
                        <SelMachBoxS onClick={ () => machineTypeSel('dryer') } active={ machineInput[0] === 'D' }>
                            <SelBoxTxtS>DRYER</SelBoxTxtS>
                        </SelMachBoxS>
                    </MichineSelectCtnS>
                    {
                        machineInput && <IdSelectCtnS>
                            {filteredMachineList.map(machine => (
                                <SelIdBoxS 
                                    key={ machine.machineId }
                                    onClick={ () => setMachineInput(machine.machineId) }
                                >
                                    <SelBoxTxtS>{ machine.machineId }</SelBoxTxtS>
                                </SelIdBoxS>
                                ))
                            }
                        </IdSelectCtnS>
                    }
                    <FooterCtnS>
                        <CancelBttnS onClick={ () => close() }>
                            <BttnTxtS>Cancel</BttnTxtS>
                        </CancelBttnS>
                        <SubmitBttnS onClick={ () => handleSubmit() }>
                            <BttnTxtS>Submit</BttnTxtS>
                        </SubmitBttnS>
                    </FooterCtnS>
                </BodyCtnS>
            </PopWindowS>
        </>
    )
}

export default AssignMachine