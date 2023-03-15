import styled from 'styled-components'
import { colorList, colors } from '../../../styles/colors'
import { device } from '../../../styles/viewport'
import { BlockerS, WindowS } from './constants'

interface TextActivityI {
    active: boolean
}

const HeaderCtnS = styled.div<TextActivityI>`
    display: ${({ active }) => active ? 'block' : 'none'};
    font-size: 24px;
    text-align: center;
`

const HeaderTxtS = styled.p<TextActivityI>`
`

const SubHeaderTxtS = styled.p<TextActivityI>`
    font-style: italic;
    font-size: 20px;
`

const BodyCtnS = styled.div<TextActivityI>`
    display: ${({ active }) => active ? 'block' : 'none'};
    padding: 10px 10px;
`

const BodyTxtS = styled.p`
    
`

const BttnCtnS = styled.div`
    display: flex;
    max-width: 300px;
    align-self: center;
    margin: 0px 1em;
    gap: 1.5em;
`

const YesBttnS = styled.button`
    border: 3px solid ${ colorList.a3 };
    color: ${ colorList.w1 };
    background-color: ${ colorList.a3 };
    border-radius: 20px;
    font-size: 24px;
    padding: 10px 1em;
    
    &:hover {
        border-color: ${ colorList.c1 };
        background-color: ${ colorList.c1 };
        cursor: pointer;
    }
    
    transition: .5s ease all;
`

const NoBttnS = styled.button`
    border: 3px solid ${ colorList.a3 };
    color: ${ colorList.w1 };
    background-color: transparent;
    border-radius: 20px;
    font-size: 24px;
    padding: 10px 1em;
    
    &:hover {
        border-color: ${ colorList.c1 };
        cursor: pointer;
    }

    transition: .5s ease all;
`

interface YayONayPopI {
    display: boolean
    head?: string
    subHead?: string
    body?: string
    onYes: Function
    onNo: Function
    loading?: boolean
}

const YayONay: React.FC<YayONayPopI> = ({
    display,
    head,
    subHead,
    body,
    onYes,
    onNo,
    loading
}: YayONayPopI) => {

    return (
        <>
            <BlockerS active={ display }/>
            {
                loading ?
                <WindowS active={ display }>
                    <HeaderCtnS active={ head || subHead ? true : false }>
                        <HeaderTxtS active={ head ? true : false }>
                            Loading...
                        </HeaderTxtS>
                    </HeaderCtnS>
                </WindowS> :
                
                <WindowS active={ display }>
                    <HeaderCtnS active={ head || subHead ? true : false }>
                        <HeaderTxtS active={ head ? true : false }>
                            { head }
                        </HeaderTxtS>
                        <SubHeaderTxtS active={ subHead ? true : false }>
                            { subHead }
                        </SubHeaderTxtS>
                    </HeaderCtnS>
                    <BodyCtnS active={ body ? true : false }>
                        <BodyTxtS>
                            { body }
                        </BodyTxtS>
                    </BodyCtnS>
                    <BttnCtnS>
                        <NoBttnS onClick={() => onNo()}>
                            No
                        </NoBttnS>
                        <YesBttnS onClick={() => onYes()}>
                            Yes
                        </YesBttnS>
                    </BttnCtnS>
                </WindowS>
            }
        </>
    )
}

export default YayONay