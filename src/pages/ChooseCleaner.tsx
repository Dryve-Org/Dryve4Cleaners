import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { api, getAttachedCleaners } from '../constants/request'
import { useGlobalContext } from '../context/global'
import useMainErrHandler from '../hook/MainErrorHook'
import { CleanerI } from '../interface/api'
import { Token } from '../interface/general'
import { colors } from '../styles/colors'

const ChooseClnS = styled.section`
`

const ChooseClnContainerS = styled.main`
    
`

const HeaderCtnS = styled.div`
    margin: 50px 0px;
`

const Header = styled.h2`
    text-align: center;
    font-size: 30px;
    color: ${ colors.orange };
`

const CardsCtnS = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    margin: 0 10%;
`

const CardS = styled.div`
    width: 100%;
    background-color: whitesmoke;
    border-radius: 20px;
    max-width: 500px;
    text-align: center;
    font-weight: 500;
    padding: 15px 0;
    border: 1px solid black;

    &:hover {
        background-color: beige;
    }
`

const CardTtlS = styled.p`
    font-size: 20px;
    
`

const CardPhn = styled.p`
    font-size: 18px;
`

const CardAddy = styled.p`
    font-size: 18px;
    font-style: italic;
`

const ClnCard: React.FC<{cln: CleanerI, action: Function}> = ({ 
    cln,
    action
}: {cln: CleanerI, action: Function}) => {

    return(
        <CardS onClick={() => action()}>
            <CardTtlS>{ cln.name }</CardTtlS>
            <CardPhn>{ cln.phoneNumber }</CardPhn>
            <CardAddy>{ cln.address.formatted }</CardAddy>
        </CardS>
    )
}



const ChooseCln: React.FC<{
    token: Token
}> = ({ token }) => {
    const nav = useNavigate()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ cleaners, setCleaners ] = useState<CleanerI[]>([])
    const { global, setGlobal } = useGlobalContext()
    const { errorHandler } = useMainErrHandler()

    useEffect(() => {
        getAttachedCleaners(token, errorHandler)
            .then(res => {
                if(!res) return
                setCleaners(res)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const selectCln = (id: string) => {
        setGlobal({
            ...global,
            cleanerId: id
        })

        nav('/dashboard')
    }

    if(loading) {
        return (
            <ChooseClnS>
                <ChooseClnContainerS>
                    <HeaderCtnS>
                        <Header>Loading...</Header>
                    </HeaderCtnS>
                </ChooseClnContainerS>
            </ChooseClnS>
        )
    }

    if(!cleaners.length) {
        return (
            <ChooseClnS>
                <ChooseClnContainerS>
                    <HeaderCtnS>
                        <Header>Error</Header>
                    </HeaderCtnS>
                </ChooseClnContainerS>
            </ChooseClnS>
        )
    }

    return(
        <ChooseClnS>
            <ChooseClnContainerS>
                <HeaderCtnS>
                    <Header>Choose Cleaner</Header>
                </HeaderCtnS>
                <CardsCtnS>
                    {cleaners.map(cln => <ClnCard 
                        cln={ cln } 
                        action={ () => selectCln(cln._id) }
                    />)}  
                </CardsCtnS>
            </ChooseClnContainerS>
        </ChooseClnS>
    )
}

export default ChooseCln