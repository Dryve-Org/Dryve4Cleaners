import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { api } from '../constants/request'
import { useGlobalContext } from '../context/global'
import { CleanerI } from '../interface/api'

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
`

const CardsCtnS = styled.section`
    display: flex;
    justify-content: center;
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

const ChooseCln: React.FC<{}> = () => {
    const nav = useNavigate()
    const [ cleaners, setCleaners ] = useState<CleanerI[]>([])
    const { global, setGlobal } = useGlobalContext()
    const { token } = global

    const retreiveCleaners = async () => {
        try {
            const clns = await api(token)
                .get<CleanerI[]>('/cleanerPro/attached_cleaners')
                .then(res => res.data)


            console.log('clns: ', clns)
            setCleaners(clns)
        } catch {
            setCleaners([])
        }
            
    }

    useEffect(() => {
        retreiveCleaners()
    }, [])

    const selectCln = (id: string) => {
        setGlobal({
            ...global,
            cleanerId: id
        })

        nav('/')
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
                        action={ () => selectCln(cln._id)}
                    />)}  
                </CardsCtnS>
            </ChooseClnContainerS>
        </ChooseClnS>
    )
}

export default ChooseCln