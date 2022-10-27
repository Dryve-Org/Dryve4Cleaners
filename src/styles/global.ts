import { createGlobalStyle } from 'styled-components';
import colors from './colors';

const mainFont = `'Baloo Bhaijaan 2', cursive`

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
    }

    body {
        background-color: ${ colors.background };
    }

     /* width */
     ::-webkit-scrollbar {
        width: 7px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        border-radius: 10px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #C4C4C4;
        border-radius: 9px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: black; 
    }

    ::selection {
        color: #fff;
        background: #4ABC93;
    }
`

export default GlobalStyles