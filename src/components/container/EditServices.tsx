import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { numToMoney } from '../../constants/money'
import { getServices } from '../../constants/request'
import { GlobalContext, useGlobalContext } from '../../context/global'
import { CleanerI, ServiceI } from '../../interface/api'
import { colors } from '../../styles/colors'
import { device } from '../../styles/viewport'

const EditServiceCtnS = styled.section`
    
`

const EditServiceHeadS = styled.div`
    background-color: ${ colors.orange };
    padding: 15px;
`

const EditServiceHeadTxtS = styled.h3`
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

const ErrorS = styled.div`
    
`

const ErrorTxtS = styled.p`
    text-align: center;
    color: ${ colors.orange };
    font-weight: 500;
`

interface EditServicesI {
    clnId: CleanerI['_id']
    addSubSvc: (
        serviceId: string,
        subtract: boolean,
        svc: ServiceI
    ) => void
}

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
            <CardPriceS>
                { numToMoney(price) }
            </CardPriceS>
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

const EditServices: React.FC<EditServicesI> = ({
    clnId,
    addSubSvc
}: EditServicesI) => {
    const [services, setServices] = useState<CleanerI['services']>()
    const { global } = useGlobalContext()
    const { token } = global

    useEffect(() => {
        getServices(token, clnId)
            .then(res => {
                if(res) {
                    setServices(res)
                }
            })
            .catch(() => {
                //throw error here
            })
    }, [])

    if(!services) {
        return (
            <EditServiceCtnS>
                <EditServiceHeadS>
                <EditServiceHeadTxtS>
                        Edit Services
                    </EditServiceHeadTxtS>
                </EditServiceHeadS>
                <ErrorS>
                    <ErrorTxtS>
                        Could not get Cleaner's services
                    </ErrorTxtS>
                </ErrorS>
            </EditServiceCtnS>
        )
    }

    return (
        <EditServiceCtnS>
            <EditServiceHeadS>
                <EditServiceHeadTxtS>
                    Edit Services
                </EditServiceHeadTxtS>
            </EditServiceHeadS>
            <ServicesListS>
                { services.map(svc => <ServiceCard 
                            service={ svc }
                            addSubSvc={ addSubSvc }
                        />
                    ) 
                }
            </ServicesListS>
        </EditServiceCtnS>
    )
}

export default EditServices