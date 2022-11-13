import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import { device } from '../../../styles/viewport'

interface TextActivityI {
    active: boolean
}

const BlockerS = styled.div<TextActivityI>`
    position: absolute;
    display: ${({ active }) => active ? 'block' : 'none'};
    background-color: ${ colors.darkGrey };
    opacity: .5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
`

const WindowS = styled.section<TextActivityI>`
    display: ${({ active }) => active ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    background-color: ${ colors.black };
    height: 100%;
    gap: 5em;
    /* padding: 1em 0px; */

    @media ${ device.tablet } { 
        width: 500px;
        height: 400px;
        border: 3px solid ${ colors.orange };
        border-radius: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

const HeaderCtnS = styled.div<TextActivityI>`
    display: ${({ active }) => active ? 'block' : 'none'};
    color: ${ colors.orange };
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
    border: 3px solid ${ colors.orange };
    color: ${ colors.black };
    background-color: ${ colors.orange };
    border-radius: 20px;
    font-size: 24px;
    padding: 10px 1em;

    &:hover {
        border-color: ${ colors.black };
    }

    transition: .5s ease all;
`

const NoBttnS = styled.button`
    border: 3px solid ${ colors.orange };
    color: ${ colors.orange };
    background-color: transparent;
    border-radius: 20px;
    font-size: 24px;
    padding: 10px 1em;

    &:hover {
        border-color: ${ colors.black };
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