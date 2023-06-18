import styled from 'styled-components'
import { numToMoney } from '../../../constants/money'
import { toggleWeightPopParams } from '../../../hook/GetWeightHook'
import { ServiceI, CleanerI } from '../../../interface/api'
import { colorList, colors } from '../../../styles/colors'
import { EditServicesI } from './EditServices'

const CardS = styled.div`
    background-color: ${ colorList.c1 };
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    text-align: center;
    border: 2px solid ${ colorList.a3 };
    min-width: 250px;
    max-width: 350px;
    color: ${ colors.black };
    margin-bottom: 1em;
    cursor: pointer;
`

const CardNameS = styled.p`
    font-size: 20px;
    font-weight: 500;
`

const CardDescription = styled.p`
    font-size: 20px;
    font-weight: 500;
    font-style: italic;
`
    
const CardPriceS = styled.p`
    font-weight: 500;
`

const CardBttnCtn = styled.div`
    display: flex;
    justify-content: space-around;
`

const CardAddBttn = styled.button`
    padding: 1em;
    border-radius: 10px;
    width: 40%;
    padding: 10px 10px;
    font-size: 20px;
    background-color: ${ colors.black };
    color: ${ colors.orange };
    border: 3px solid ${ colors.orange };
`

const CardRemBttn = styled.button`
    padding: 1em;
    border-radius: 10px;
    width: 40%;
    padding: 10px 10px;
    font-size: 20px;
    background-color: ${ colors.secondaryOffGold };
    color: ${ colors.black };
    border: 3px solid ${ colors.orange };
`

const EditServiceCard = ({
    service,
    toggleWeightPop
}: {
    service: ServiceI
    toggleWeightPop: toggleWeightPopParams
}) => {
    const { 
        name, 
        price, 
        description,
        _id
    } = service
    return (
        <CardS onClick={ () => toggleWeightPop(service) }>
            <CardNameS>
                { name }
            </CardNameS>
            <CardDescription>
                { description }
            </CardDescription>
        </CardS>
    )
}

export default EditServiceCard