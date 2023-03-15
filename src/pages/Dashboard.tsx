import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import styled from "styled-components"
import OrderDetails from "../components/mid/OrderDetails"
import ActiveOrdersSide from "../components/side/ActiveOrders"
import { getCleaner } from "../constants/request"
import { useGlobalContext } from "../context/global"
import { CleanerI, OrderI } from "../interface/api"
import { device } from "../styles/viewport"

const DashboardS = styled.section`
    overflow: auto;
    @media ${ device.desktop } {
        display: flex;
        flex-grow: 2;
        height: calc(100vh - 60px);
        overflow: hidden;
    }
`

const Dashboard = () => {
    const [ chosenOdr, setChosenOdr ] = useState<OrderI['_id']>()
    const [ orderUpdate, setOrderUpdate ] = useState<boolean>(false)
    const [ cleaner, setCleaner ] = useState<CleanerI>()
    const params = useParams<{ orderId: string }>()
    const nav = useNavigate()
    const { global } = useGlobalContext()
    
    useEffect(() => {
        setChosenOdr(params.orderId)

        getCleaner(global.token, global.cleanerId)
            .then(res => res && setCleaner(res))
            .catch(err => console.log(err))     
    }, [ params ])
    
    const retreiveOrder = async (orderId: string) => {
        nav(`${ orderId }`)
    }

    return(
        <DashboardS>
            <ActiveOrdersSide 
                onOrderPress={ retreiveOrder }
                orderUpdate={ orderUpdate }
                setOrderUpdate={ setOrderUpdate }
            />
            <OrderDetails 
                orderId={ chosenOdr }
                back={ () => nav('') }
                setOrderUpdate={ setOrderUpdate }
                cleaner={ cleaner }
            />
        </DashboardS>
    )
}

export default Dashboard