import styled from 'styled-components'
import { desiredService, OrderI, ServiceI } from '../../interface/api'
import { colors, colorList } from '../../styles/colors'
import { numToMoney } from '../../constants/money'
import { device } from '../../styles/viewport'

const SerivcesCtnS = styled.section`
    /* border: 2px solid ${ colorList.a3 }; */
`

const ServicesHeadS = styled.div`
    border-bottom: 2px solid ${ colorList.a3 };
    padding: 15px;
    color: ${ colorList.a3 };
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
        /* justify-content: center; */
    }
`

const CardS = styled.div`
    /* background-color: ${ colorList.a3 }; */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    text-align: center;
    border: 2px solid ${ colorList.c1 };
    box-shadow: 0 0 10px 1px ${ colorList.c1 }80;
    min-width: 200px;
    max-width: 350px;
    color: ${ colorList.a3};
    margin-bottom: 1em;
    max-width: 20.0px;
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
    service,
    weight
}: desiredService) => {

    return (
        <CardS>
            <CardNameS>
                { service.title }
            </CardNameS>
            <CardQuantity>
                {
                    service.perPound ?
                    `Weight: ${ weight }` :
                    `Quantity: ${ quantity }`
                }
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
                    Desired Services
                    {isUpdated ? ' (not saved)' : ''}
                </ServicesHeadTxtS>
            </ServicesHeadS>
            <ServicesListS>
                { desiredServices.map(svc => <SvcCard {...svc} />) }
            </ServicesListS>
        </SerivcesCtnS>
    )
}

export default RequestedServices