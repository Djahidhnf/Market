import axios from "axios";


async function Success({params}: {params: {slug: string}}) {



    let order;
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?id=${params.slug}`);
        order = res.data;
        console.log(res.data)
    } catch (err) {
        console.error(err);
    }

    
  return (
    <section className="h-fill md:flex md:flex-col md:items-center px-5 md:px-30 pt-30">
      {/* <div className="w-[50%]"> */}
      
      <div className=" md:w-120">
        <h1 className="text-4xl font-bold mt-10 mb-5">Votre reçus</h1>
        {/* <p className="my-5">Faite une capture d'ecran de reçus et garder le jusqua que votre commande arrive.</p> */}
      </div>

      <div className="bg-white h-fit  md:w-120 border-4 border-gray-700 border-dashed">
        <h1 className="text-3xl font-semibold text-center my-2">
          CITY MARKET
        </h1>
        <div className="text-center text-xl">
          <p>Millenium 2, Oran</p>
          <p>0783 30 64 64</p>
          <p>Date: 14/04/2025 {new Date(order.createdAt).toLocaleString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</p>
          {/* <p>Time: {new Date(order.createdAt).toLocaleString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</p> */}
        </div>

        <table className="w-[90%] my-10 mx-auto">
          <thead className="text-xl text-left">
            <tr>
              <th className="font-semibold">Produit</th>
              <th className="font-semibold">Qte</th>
              <th className="font-semibold">P.U</th>
              <th className="font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="">
            {order.products.map(item => (
                <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{parseInt(item.price) * item.quantity}</td>
                </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between px-5 text-xl font-bold">
          <h1>Total a payer:</h1>
          <h1>{order.total} DA</h1>
        </div>
        <div className="flex justify-between p-5 font-semibold">
            <h1>Commande ID:</h1>
            <h1>{order._id}</h1>
        </div>
        <p className="my-10 text-center text-xl">Merci pour votre confiance 👋</p>
      </div>
      {/* </div> */}
    </section>
  );
}

export default Success;
