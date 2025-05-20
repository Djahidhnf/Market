"use client";

import { IOrder } from "@/models/Order";
import AdminOrdersButtons from "./AdminOrdersButtons";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function AdminOrdersList({ orders }: { orders: IOrder[] }) {
  const route = useRouter();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  function handleSelectedOrders(event: React.ChangeEvent<HTMLInputElement>) {
    const id = event.target.value;
    if (id === "All" && selectedOrders.includes("All")) {
      setSelectedOrders([]);
      return;
    } else if (id === "All") {
      setSelectedOrders(["All"]);
      return;
    }

    if (selectedOrders.includes(id)) {
      const updated = selectedOrders.filter((item) => item !== id);
      setSelectedOrders(updated);
    } else {
      setSelectedOrders((prev) => [...prev, id]);
    }
  }

  async function handleStatusSubmit(status: boolean) {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        { selectedOrders: selectedOrders, status: status }
      );
      setSelectedOrders([]);
      route.refresh();
      // console.log(status)
    } catch (err) {
      throw console.error(err);
    }
  }

  return (
    <div>
      <div className="bg-white rounded-t-lg h-15 w-[99.6%] px-5 flex items-center justify-between">
        <div className="flex">
          <div className="border-r-1 border-accent pr-5 mr-5">
            <button
              name="status"
              className="bg-green-800 hover:bg-green-700 rounded-md size-8 mr-3"
              onClick={() => handleStatusSubmit(true)}
              disabled={selectedOrders.length === 0}
            >
              <svg
                className="mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="rgba(255,255,255,1)"
              >
                <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"></path>
              </svg>
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-400 rounded-md size-8"
              onClick={() => handleStatusSubmit(false)}
              disabled={selectedOrders.length === 0}
            >
              <svg
                className="mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="rgba(255,255,255,1)"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
              </svg>
            </button>
          </div>
          {selectedOrders.length === 0 && 
            <p className="text-xl text-secondary-500 flex items-center">{orders.length} Commandes</p>
          || <p className="text-xl text-secondary-500 flex items-center">{selectedOrders.includes('All')? orders.length : selectedOrders.length} / {orders.length} Commande selectioné</p>
          }
        </div>
        <div>
            <input type="date" name="data" className="bg-gray-200 border-1 border-secondary-200 text-gray-600 rounded-full h-10 px-3"/>
        </div>
      </div>

      {/* //! orders list */}
    <div className="h-110 overflow-y-scroll custom-scrollbar border-collapse rounded-b-lg">
      <table className="w-full text-left">
        <thead className="bg-secondary-500 text-white text-md h-12 sticky top-0 z-20">
          <tr>
            <th className="w-10 pl-2">
              <input
                type="checkbox"
                name="All"
                value="All"
                className="size-4"
                onChange={handleSelectedOrders}
                checked={selectedOrders.includes("All")}
              />
            </th>
            <th className="px-2 w-40">Date</th>
            <th className="px-2 w-30">Status</th>
            <th className="px-2 w-[20%]">Info</th>
            <th className="px-2 w-[40%]">Produits</th>
            <th className="px-2 w-[8%]">Total</th>
            <th className="px-2 text-center w-[8%]">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {orders.map((order) => (
            <tr
              key={order._id}
              className={`border-b-1 border-gray-300 h-20 cursor-pointerhover:bg-blue-300/60 cursor-pointer hover:bg-gray-200`}
            >
              <td className="pl-2">
                <input
                  type="checkbox"
                  className="size-4"
                  name="select"
                  value={order._id}
                  onChange={handleSelectedOrders}
                  checked={
                    selectedOrders.includes(order._id) ||
                    selectedOrders.includes("All")
                  }
                />
              </td>
              <td>
                <p className="mx-2">
                  {new Date(order.createdAt).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </td>
              <td className={` text-white text-center`}>
                <p className={`${ order.status? "bg-green-700" : "bg-yellow-500"} rounded-md w-25 mx-2`}>
                    {order.status === true ? "Livré" : "Attente"}
                </p>
              </td>
              <td className="">
                <p className="mx-2">{order.name}</p>
                <p className="mx-2">{order.phone}</p>
                <p className="mx-2">{order.address}</p>
              </td>
              <td>
                {order.products.map(product => (
                  <p key={product.name} className="mx-2">
                    {product.name} x{product.quantity}
                  </p>
                ))}
              </td>
              <td>
                <p className="mx-2">
                  {order.total} DA
                </p>
              </td>
              <td>
                  <AdminOrdersButtons id={order._id} status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    </div>
  );
}

export default AdminOrdersList;
