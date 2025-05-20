import AdminOrdersList from "@/components/AdminOrdersList";
import axios from "axios";
import { IOrder } from "@/models/Order";

async function orders() {

  let orders;
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`)
    orders = res.data
  } catch (err) {
    console.error('Error:', err)
  }

  return (
    <section>
      <h1 className="text-4xl font-medium">Commandes</h1>

      <div className="flex gap-5 my-5">
        <div className="bg-white rounded-lg w-70 h-30">
          <h1 className="text-2xl font-medium text-center py-2">Commandes</h1>
          <h1 className="text-6xl text-center text-secondary-500 font-semibold">
            {orders.length}
          </h1>
        </div>
        <div className="bg-white rounded-lg w-70 h-30">
          <h1 className="text-2xl font-medium text-center py-2">Nouveaux</h1>
          <h1 className="text-6xl text-center text-secondary-500 font-semibold">
            {}
          </h1>
        </div>
        <div className="bg-white rounded-lg w-70 h-30">
          <h1 className="text-2xl font-medium text-center py-2">En Attente</h1>
          <h1 className="text-6xl text-center text-secondary-500 font-semibold">
            {orders.filter((order: { status: boolean; }) => order.status === false).length}
          </h1>
        </div>
      </div>

      <AdminOrdersList orders={orders}/>
    </section>
  );
}

export default orders;
