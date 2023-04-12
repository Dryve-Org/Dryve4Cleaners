
import styled from 'styled-components'
import { numToMoney } from '../../../constants/money'
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
    font-weight: bolder;
    background-color: ${ colorList.a3 };
    color: ${ colorList.b1 };
    border: 3px solid ${ colorList.b1 };
    cursor: pointer;
`

const CardRemBttn = styled.button`
    padding: 1em;
    border-radius: 10px;
    width: 40%;
    padding: 10px 10px;
    font-size: 20px;
    background-color: ${ colorList.b1 };
    color: ${ colorList.e1 };
    border: 3px solid ${ colorList.e1 };
    cursor: pointer;
`

const ServiceCard = ({
    service,
    addSubSvc
}: {
    service: ServiceI
    addSubSvc: EditServicesI['addSubSvc']
}) => {
    const { 
        title, 
        price, 
        description,
        _id
    } = service
    return (
        <CardS>
            <CardNameS>
                { title }
            </CardNameS>
            <CardDescription>
                { description }
            </CardDescription>
            <CardBttnCtn>
                <CardRemBttn onClick={ () => addSubSvc(_id, true, service)}>
                    Remove
                </CardRemBttn>
                <CardAddBttn onClick={ () => addSubSvc(_id, false, service)}>
                    Add
                </CardAddBttn>
            </CardBttnCtn>
        </CardS>
    )
}

export default ServiceCard