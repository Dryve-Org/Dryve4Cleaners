import throttle from '@jcoreio/async-throttle'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { numToMoney } from '../../../constants/money'
import { getServices } from '../../../constants/request'
import { GlobalContext, useGlobalContext } from '../../../context/global'
import { CleanerI, ServiceI } from '../../../interface/api'
import { colors, colorList } from '../../../styles/colors'
import { device } from '../../../styles/viewport'
import EditServiceCard from './EditWeight'
import ServiceCard from './ServiceCard'

const EditServiceCtnS = styled.section`
    
`

const EditServiceHeadS = styled.div`
    background-color: ${ colorList.a3 };
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

const ErrorS = styled.div`
    
`

const ErrorTxtS = styled.p`
    text-align: center;
    color: ${ colors.orange };
    font-weight: 500;
`

export interface EditServicesI {
    cleaner: CleanerI
    addSubSvc: (
        serviceId: string,
        subtract: boolean,
        svc: ServiceI
    ) => void
    toggleWeightPop: () => void
}

const EditServices: React.FC<EditServicesI> = ({
    cleaner,
    addSubSvc,
    toggleWeightPop
}: EditServicesI) => {
    const [services, setServices] = useState<CleanerI['services']>()
    const { global } = useGlobalContext()
    const { token } = global

    const getServicesThrt = throttle(getServices, 1000)

    useEffect(() => {
        getServicesThrt(token, cleaner._id)
            .then(res => {
                if(res) {
                    setServices(
                        res.filter(service => {
                            return service._id !== cleaner.minPriceServiceId || service.perPound
                        })
                    )
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
            {
                services.filter(svc => svc.perPound).length > 0 && (
                    <>
                        <EditServiceHeadS>
                            <EditServiceHeadTxtS>
                                Edit Weight
                            </EditServiceHeadTxtS>
                        </EditServiceHeadS>
                        <ServicesListS>
                            { services.map(svc => svc.perPound && <EditServiceCard 
                                        service={ svc }
                                        toggleWeightPop={ toggleWeightPop }
                                    />
                                ) 
                            }
                        </ServicesListS>
                    </>
                )
            }
            <EditServiceHeadS>
                <EditServiceHeadTxtS>
                    Edit Services
                </EditServiceHeadTxtS>
            </EditServiceHeadS>
            <ServicesListS>
                { services.map(svc => !svc.perPound && <ServiceCard 
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