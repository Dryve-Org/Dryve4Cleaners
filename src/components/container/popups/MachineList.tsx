import { useNavigate } from "react-router"
import styled from "styled-components"
import { unixToDate } from "../../../constants/time"
import { MachineI } from "../../../interface/api"
import { colorList } from "../../../styles/colors"
import { ActivityI, BlockerS, ExitCntS, ExitSvgS, NoBttnS, PopupI, WindowS, YesBttnS } from './constants'


const PopBlockerS = styled(BlockerS)``

const PopWindowS = styled(WindowS)`
    display: ${({ active }) => active ? 'block' : 'none'};
`

const HeaderCtnS = styled.div<ActivityI>`
    font-size: 24px;
    text-align: center;
    margin: .5em 0;
`

const HeaderTxtS = styled.p`
`

const BodyCtnS = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    justify-content: space-around;
    margin: 0 1em;
`

const MachineCardS = styled.button<{ status: MachineI['status'] }>`
    display: grid;
    justify-content: space-around;
    word-break: break-word;
    grid-template-columns: 1fr 1fr;
    height: 80px;
    border: 2px solid ${ colorList.a3 };
    background-color: ${ colorList.b1 };
    text-align: left;
    border-radius: 5px;
    padding: 3px;
    text-align: center;
    cursor: pointer;
    
    ${({ status }) => {
        switch(status) {
            case 'Available':
                return `
                    border: 3px solid ${ colorList.c1 };
                `
            case 'In Use':
                return `
                    border: 3px solid ${ colorList.a3 };
                    color: ${ colorList.w1 };
                `
            case 'Out of Order':
                return `
                    border: 3px solid red;
                `
            default:
                return `
                    border: 3px solid red;
                `
        }
    }}

    &:hover {
        filter: brightness(1.8);
    }
    transition: ease .25s filter;
`

const MachineIdS = styled.p``
const MachineStatusS = styled.p``
const MachineUnitS = styled.p`
    flex-basis: 100%;
    flex: 2;
    width: 100%;
`
const LastUpdatedS = styled.p``


const MachineCard = ({
    machine,
    handleMachineClick
}: {
    machine: MachineI
    handleMachineClick: (machine: MachineI) => void
}) => {

    return(
        <MachineCardS 
            status={ machine.status }
            onClick={ () => handleMachineClick(machine) }
        >
            <MachineIdS>{ machine.machineId }</MachineIdS>
            <MachineStatusS>{ machine.status }</MachineStatusS>
            <MachineUnitS>{ machine.attachedUnitId }</MachineUnitS>
            <MachineUnitS>{ unixToDate(machine.lastUpdated) }</MachineUnitS>
        </MachineCardS>
    )
}

interface MachineListI extends PopupI {
    close: () => void
    machines: MachineI[]
}

const MachineList: React.FC<MachineListI> = ({
    display,
    machines,
    close
}) => {
    const nav = useNavigate()

    const handleMachineClick = (machine: MachineI): void => {
        nav(`/dashboard/${ machine.attachedOrder }`)
        close()
    }

    return(
        <>
            <PopBlockerS active={ display } />
            <PopWindowS active={ display }>
                <HeaderCtnS active={ display }>
                    <ExitCntS onClick={ () => close() }>
                        <ExitSvgS />
                    </ExitCntS>
                    <HeaderTxtS>Machine List</HeaderTxtS>
                </HeaderCtnS>
                <BodyCtnS>
                    { machines.map((machine, i) => (
                        <MachineCard 
                            key={ i } 
                            machine={ machine } 
                            handleMachineClick={ handleMachineClick }
                        />
                    )) }
                </BodyCtnS>
            </PopWindowS>
        </>
    )
}

export default MachineList