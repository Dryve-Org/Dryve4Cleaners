import styled from 'styled-components'
import { colors } from '../../styles/colors'

const ScreenCtnS = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${ colors.darkGrey };
`

const ScreenTxtS = styled.p`
    text-align: center;
    font-size: 24;
    color: ${ colors.orange };
    font-weight: 700;
`

const GlobalLoading = () => {
    
    return (
        <ScreenCtnS>
            <ScreenTxtS>
                Loading...
            </ScreenTxtS>
        </ScreenCtnS>
    )
}

export default GlobalLoading