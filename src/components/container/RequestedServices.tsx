import styled from 'styled-components'
import { desiredService, OrderI, ServiceI } from '../../interface/api'
import { colors } from '../../styles/colors'

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
    margin: 10px 10%;
`

const CardS = styled.div`
    background-color: lightblue;
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    text-align: center;
    border: 2px black solid;
`

const CardNameS = styled.p`
    font-size: 20px;
    font-weight: 500;
`

const CardQuantity = styled.p`
    font-size: 20px;
    font-weight: 500;
`

const CardPriceS = styled.p`
    
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
            <CardQuantity>
                { quantity }
            </CardQuantity>
            <CardPriceS>
                { service.price }
            </CardPriceS>
        </CardS>
    )
}

type servicesT = Pick<OrderI, 'desiredServices'>

const RequestedServices: React.FC<servicesT> = ({
    desiredServices
}: servicesT) => {

    return (
        <SerivcesCtnS>
            <ServicesHeadS>
                <ServicesHeadTxtS>
                    Services
                </ServicesHeadTxtS>
            </ServicesHeadS>
            <ServicesListS>
                { desiredServices.map(svc => <SvcCard {...svc} />) }
            </ServicesListS>
        </SerivcesCtnS>
)
}

export default RequestedServices