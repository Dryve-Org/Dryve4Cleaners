import styled from 'styled-components'
import { desiredService, OrderI, ServiceI } from '../../interface/api'
import { colors } from '../../styles/colors'
import { numToMoney } from '../../constants/money'
import { device } from '../../styles/viewport'

const SerivcesCtnS = styled.section`
    
`

const ServicesHeadS = styled.div`
    background-color: ${ colors.orange };
    padding: 15px;
`

const ServicesHeadTxtS = styled.h3`
    font-size: 24px;
    text-align: center;
`

const ServicesListS = styled.div`
    margin: 10px 0px;
    display: flex;
    overflow-y: auto;
    gap: 1em;

    @media ${ device.desktop } {
        justify-content: center;
    }
`

const CardS = styled.div`
    background-color: ${ colors.offGold };
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    text-align: center;
    border: 2px solid ${ colors.offGold };
    min-width: 200px;
    max-width: 350px;
    color: ${ colors.black };
    margin-bottom: 1em;
`

const CardNameS = styled.p`
    font-size: 20px;
    font-weight: 500;
`

const CardQuantity = styled.p`
    font-size: 20px;
    font-weight: 500;
    font-style: italic;
`
    
const CardPriceS = styled.p`
    font-weight: 500;
`

const SvcCard = ({
    quantity,
    service
}: desiredService) => {

    return (
        <CardS>
            <CardNameS>
                { service.title }
            </CardNameS>
            <CardPriceS>
                { numToMoney(service.price) }
            </CardPriceS>
            <CardQuantity>
                Quantity: { quantity }
            </CardQuantity>
        </CardS>
    )
}

interface RequestedServicesI {
    desiredServices: OrderI['desiredServices']
    orderTotal: OrderI['orderTotal']
    isUpdated: boolean
}

const RequestedServices: React.FC<RequestedServicesI> = ({
    desiredServices,
    orderTotal,
    isUpdated
}: RequestedServicesI) => {
    orderTotal = orderTotal ? orderTotal : 0

    return (
        <SerivcesCtnS>
            <ServicesHeadS>
                <ServicesHeadTxtS>
                    Desired Services (Total: { numToMoney(orderTotal) }
                    {isUpdated ? '*' : ''})
                </ServicesHeadTxtS>
            </ServicesHeadS>
            <ServicesListS>
                { desiredServices.map(svc => <SvcCard {...svc} />) }
            </ServicesListS>
        </SerivcesCtnS>
    )
}

export default RequestedServices