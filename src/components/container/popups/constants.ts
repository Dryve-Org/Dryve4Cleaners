import styled from 'styled-components'
import { colors, colorList } from '../../../styles/colors'
import { device } from '../../../styles/viewport'

export interface ActivityI {
    active: boolean
}

export interface PopupI {
    display: boolean
    close?: () => void
}

export const WindowS = styled.section<ActivityI>`
    display: ${({ active }) => active ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    background-color: ${ colorList.b1 };
    height: 100%;
    gap: 5em;
    color: ${ colorList.w1 };
    /* padding: 1em 0px; */

    @media ${ device.tablet } { 
        width: 500px;
        height: 400px;
        border: 3px solid ${ colorList.a3 };
        border-radius: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const BlockerS = styled.div<ActivityI>`
    position: fixed;
    display: ${({ active }) => active ? 'block' : 'none'};
    background-color: ${ colors.darkGrey };
    opacity: .5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
`

export const YesBttnS = styled.button`
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

export const NoBttnS = styled.button`
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