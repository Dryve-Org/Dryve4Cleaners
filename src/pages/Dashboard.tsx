import { useEffect, useState } from "react"
import styled from "styled-components"
import OrderDetails from "../components/mid/OrderDetails"
import ActiveOrdersSide from "../components/side/ActiveOrders"
import { api, getOrder, retreivActiveOrder } from "../constants/request"
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
    const { global, setGlobal } = useGlobalContext()
    const { token, cleanerId } = global
    const [ chosenOdr, setChosenOdr ] = useState<OrderI>()

    const retreiveOrder = async (orderId: string) => {
        try {
            const order = await getOrder(token, orderId)
            console.log('order: ', order)
            if(order) {
                setChosenOdr(order)
            }
        } catch {
            //handle this at some point
        }
    }

    return(
        <DashboardS>
            <ActiveOrdersSide 
                onOrderPress={ retreiveOrder }
            />
            { <OrderDetails 
                order={ chosenOdr }
                back={ () => setChosenOdr(undefined) }
            /> }
        </DashboardS>
    )
}

export default Dashboard