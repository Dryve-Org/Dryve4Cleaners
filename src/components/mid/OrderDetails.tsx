import { OrderI } from "../../interface/api"


interface OrderDetailsI {
    order: OrderI
}

const OrderDetails: React.FC<OrderDetailsI> = ({
    order
}: OrderDetailsI) => {

    return (
        <h1>{ order.client.firstName }</h1>
    )
}

export default OrderDetails