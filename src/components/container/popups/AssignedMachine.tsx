import styled from 'styled-components'
import { BlockerS, ExitCntS, ExitSvgS, PopupI, WindowS } from './constants'
import { MachineI, OrderI } from '../../../interface/api'
import { colorList } from '../../../styles/colors'
import { unixToDate } from '../../../constants/time'
import { device } from '../../../styles/viewport'

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

const HeaderUnitIdTxtS = styled(HeaderTxtS)`
    font-size: 20px;
    font-weight: bolder;
    color: ${ colorList.w2 };
`

const BodyCtnS = styled.div`
    overflow-y: auto;
    padding: 0 1em;
    height: 100%;
    
    @media ${ device.desktop} {
        height: 300px;
    }
`

const MachineCardS = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    padding: 1em .5em;
`

const CardInfoS = styled.div`
    display: flex;
    flex-direction: column;
`

const CardInfoTxtS = styled.p`
    font-weight: bolder;
`

const BarS = styled.div`
    width: 100%;
    height: 1.5px;
    background-color: ${ colorList.a3 };
    box-shadow: 0 0 10px 1px ${ colorList.a1 }80;
`

const ActionCtnS = styled.div`
    display: flex;
    align-items: center;
`

const ActionBtnS = styled.button`
    border: 2px solid ${ colorList.e1 };
    box-shadow: inset 0px 0px 5px 0px ${ colorList.e1 };
    padding: .5em;
    border-radius: 5px;
    background-color: transparent;
    color: ${ colorList.e1 };
    font-size: 18px;
    font-weight: bolder;
    cursor: pointer;

    &:hover {
        background-color: ${ colorList.e1 };
        color: ${ colorList.w1 };
    }

    &:active {
        border: 2px solid ${ colorList.w1 };
    }

    transition: all .2s ease-in-out;
    transition: border .1s ease-in-out;
`

interface MachineCardI {
    machine: MachineI
    onRemove: (machineId: string) => boolean | Promise<boolean>
}

const MachineCard: React.FC<MachineCardI> = ({ 
    machine,
    onRemove
}) => {
    const [ date, time ] = unixToDate(machine.lastUpdated).split(', ')

    return (
        <>
            <MachineCardS>
                <CardInfoS>
                    <CardInfoTxtS>{ machine.machineId }</CardInfoTxtS>
                    {/* <CardInfoTxtS>{ machine.status }</CardInfoTxtS> */}
                    <CardInfoTxtS>{ date },</CardInfoTxtS>
                    <CardInfoTxtS>{ time }</CardInfoTxtS>
                </CardInfoS>
                <ActionCtnS>
                    <ActionBtnS onClick={ () => onRemove(machine.machineId) }>
                        Remove
                    </ActionBtnS>
                </ActionCtnS>
            </MachineCardS>
            <BarS />
        </>
    )
}

interface AssignedMachinesI extends PopupI {
    onRemove: (machineId: string) => boolean | Promise<boolean>
    close: () => void
    machines: MachineI[]
    order: OrderI
    loading: boolean
}

const AssignedMachines: React.FC<AssignedMachinesI> = ({
    display,
    machines,
    order,
    close,
    loading,
    onRemove
}) => {
    if(loading) return (
        <>
            <PopBlockerS active={ display }/>
            <PopWindowS active={ display }>
                <ExitCntS onClick={ () => close() }>
                    <ExitSvgS />
                </ExitCntS>
                <HeaderCtnS>
                    <HeaderTxtS>Assigned Machines</HeaderTxtS>
                    <HeaderUnitIdTxtS>{ order.unitId }</HeaderUnitIdTxtS>
                    <HeaderTxtS>Loading...</HeaderTxtS>
                </HeaderCtnS>
            </PopWindowS>
        </>
    )

    return (
        <>
            <PopBlockerS active={ display }/>
            <PopWindowS active={ display }>
                <ExitCntS onClick={ () => close() }>
                    <ExitSvgS />
                </ExitCntS>
                <HeaderCtnS>
                    <HeaderTxtS>Assigned Machines</HeaderTxtS>
                    <HeaderUnitIdTxtS>{ order.unitId }</HeaderUnitIdTxtS>
                </HeaderCtnS>
                <BodyCtnS>
                    { machines.map(machine => (
                        <MachineCard 
                            key={ machine.machineId } 
                            machine={ machine } 
                            onRemove={ onRemove }
                        />
                    )) }
                </BodyCtnS>
            </PopWindowS>
        </>
    )
}

export default AssignedMachines