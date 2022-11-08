import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import styled from "styled-components"
import OrderDetails from "../components/mid/OrderDetails"
import ActiveOrdersSide from "../components/side/ActiveOrders"
import { api, getOrder } from "../constants/request"
import { useGlobalContext } from "../context/global"
import { CleanerI, OrderI, orderStatuses } from "../interface/api"
import { device } from "../styles/viewport"

const DashboardS = styled.section`
    @media ${ device.desktop } {
        display: flex;
        flex-grow: 2;
    }
`

const Dashboard = () => {
    const [ chosenOdr, setChosenOdr ] = useState<OrderI['_id']>()
    const params = useParams<{ orderId: string }>()
    const nav = useNavigate()
    
    useEffect(() => {
        setChosenOdr(params.orderId)
    }, [ params ] )
    
    const retreiveOrder = async (orderId: string) => {
        nav(`${ orderId }`)
    }

    return(
        <DashboardS>
            <ActiveOrdersSide 
                onOrderPress={ retreiveOrder }
            />
            <OrderDetails 
                orderId={ chosenOdr }
                back={ () => nav('') }
            />
        </DashboardS>
    )
}

export default Dashboard