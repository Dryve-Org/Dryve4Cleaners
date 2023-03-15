import { useState } from 'react'
import styled from 'styled-components'
import { ServiceI } from '../../../interface/api'
import { ActivityI, BlockerS, NoBttnS, PopupI, WindowS, YesBttnS } from './constants'

const PopBlockerS = styled(BlockerS)``

const PopWindowS = styled(WindowS)``



const HeaderCtnS = styled.div<ActivityI>`
    font-size: 24px;
    text-align: center;
`

const HeaderTxtS = styled.p`
`

const BodyCtnS = styled.div<ActivityI>`
    display: flex;
    justify-content: center;
    align-items: center;
`

const WeightInputS = styled.input`
    width: 100px;
    height: 50px;
    font-size: 20px;
    padding: 0;
`

const LbsS = styled.p`
    font-size: 20px;
    padding: 0;
`

const BttnCtnS = styled.div`
    display: flex;
    max-width: 300px;
    align-self: center;
    margin: 0px 1em;
    gap: 1.5em;
`

const SubHeaderTxtS = styled.p`
    font-style: italic;
    font-size: 20px;
`

interface GetWeightPopI extends PopupI {
    service?: ServiceI
    submitWeight: (weight: number) => void
    close: () => void
}

const GetWeightPop: React.FC<GetWeightPopI> = ({
    display,
    close,
    submitWeight,
    service
}) => {
    const [ weight, setWeight ] = useState<string>('0')

    return (
        <>
            <PopBlockerS active={ display } />
            <PopWindowS active={ display }>
                <HeaderCtnS active={ display }>
                    <HeaderTxtS>{ service ? service.title : 'Input Clothes Weight' }</HeaderTxtS>
                    <SubHeaderTxtS>{ service ? service.description : '' }</SubHeaderTxtS>
                </HeaderCtnS>
                <BodyCtnS active={ display }>
                    <WeightInputS
                        type="number"
                        value={ weight }
                        onChange={ e => setWeight(e.target.value) }
                    /><LbsS>lbs</LbsS>
                </BodyCtnS>
                <BttnCtnS>
                    <NoBttnS onClick={ () => close() }>Cancel</NoBttnS>
                    <YesBttnS onClick={ () => submitWeight(parseFloat(weight)) }>Submit</YesBttnS>
                </BttnCtnS>
            </PopWindowS>
        </>
    )
}

export default GetWeightPop;