import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useGlobalContext } from '../../context/global'
import { colors } from '../../styles/colors'
import { device } from '../../styles/viewport'


const HeaderS = styled.section`
    height: 55px;
    background-color: ${ colors.offGold };
    color: ${ colors.black };
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1px 10px;
`

const TitleS = styled.h1``

interface LinksCtnSI {
    active: boolean
}

const fadeIn = keyframes`
  from {
    transform: scale(.25);
    opacity: 0;
    border-radius: 50%;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 0;
  }

  to {
    transform: scale(.25);
    opacity: 1;
    border-radius: 50%;
  }
`;

const LinksCtnS = styled.ul<LinksCtnSI>`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding-top: 5em;
    /* justify-content: space-around; */
    align-items: center;
    height: 100%;
    width: 100%;
    z-index: 100;
    background-color: ${ colors.black };
    opacity: ${({active}) => active ? 1 : 0};
    visibility: ${({active}) => active ? 'visible' : 'hidden'};
    animation: ${({active}) => active ? fadeIn : fadeOut} .5s linear;
    animation-fill-mode: forwards;
    color: ${ colors.secondaryOffGold };

    @media ${ device.desktop } {
        position: static;
        flex-direction: row;
        padding-top: initial;
        gap: 1em;
        justify-content: right;
        color: ${ colors.black };
        visibility: visible;
        animation: none;
        opacity: 1;
        align-items: center;
        background-color: transparent;
    }

    transition: .5s ease all;
`

const LinkS = styled(Link)`
    width: fit-content;
    padding: 3px 9px;
    border-radius: 20px 20px;
    border: 2px solid ${ colors.black };
    font-weight: 700;
    font-size: 18px;
    text-decoration: underline;
    color: ${ colors.secondaryOffGold };

    @media ${ device.desktop } {
        color: ${ colors.black };
        text-decoration: none;
    }
`

const NavBttnS = styled.div`
    position: absolute;
    right: 10px;
    z-index: 101;
    color: ${ colors.orange };
    font-size: 25px;
    font-weight: 700;

    @media ${ device.desktop } {
        display: none;
    }
`

const MainHeader = () => {
    const [ isNav, setIsNav ] = useState<boolean>(false)
    const navigation = useNavigate()
    const { global, setGlobal } = useGlobalContext()
    const { token } = global

    const handleLinkClick = () => {
        setIsNav(false)
    }

    const handleLogoutLink = async () => {
        handleLinkClick()
        localStorage.setItem('token', '')
        setGlobal({
            ...global,
            token: ''
        })
    }
    
    return(
        <HeaderS>
            <TitleS>
                Dryve4Cleaners
            </TitleS>
            <LinksCtnS active={ isNav }>
                <LinkS onClick={() => handleLinkClick()} to='/dashboard'>Dashboard</LinkS>
                <LinkS onClick={() => handleLinkClick()} to='/choose_cleaner'>Choose Cleaners</LinkS>
                { token && <LinkS onClick={() => handleLogoutLink()} to='/login'>Logout</LinkS>}
            </LinksCtnS>
            <NavBttnS onClick={() => setIsNav(!isNav)}>
                X
            </NavBttnS>
        </HeaderS>
    )
}

export default MainHeader