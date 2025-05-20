import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { IProduct } from "@/models/Product";
const {createHmac} = await import('node:crypto');

export async function GET(req: Request) {
  try {
    await mongooseConnect();
    const orderId = new URL(req.url).searchParams.get('id');

    let orders;
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json({ error: "ID non valide" }, { status: 400 });
      }

      orders = await Order.findById(orderId);
    } else {
      orders = await Order.find().sort({createdAt: -1});
    }
    
    return NextResponse.json(orders, { status: 200 });
    
  } catch (err) {
    console.error("Erreur lors de la récupération des commandes:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}




export async function POST(req: Request) {
    try {
        await mongooseConnect();

        const {formData, cart, cartHash} = await req.json();

        const hmac = createHmac('sha256', process.env.SECRET_HASH_KEY!);
        hmac.update(JSON.stringify(cart));
        const hashedData = hmac.digest('hex');
        

        if (cartHash === hashedData) {
          const order = {
            ...formData,
            products: cart.map(product => {
              return {
                _id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
              }
            }),
            total: cart.reduce((total, item) => total + item.quantity * (item.discounted !== ''? parseInt(item.discounted) : parseInt(item.price)), 0)
          }
          const newOrder = await Order.create(order);
          console.log(newOrder)

          for (const item of cart) {
            const newStock = item.stock - item.quantity;
            await Product.findByIdAndUpdate(item.id, {stock: newStock}, {new: true})
          }
          return NextResponse.json({message: "Order created succesfully!", order: newOrder}, {status: 200});
        } else {
          return NextResponse.json({message: "Nice try :)"})
        }


    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({error: "Creation de la commande a echoué"}, {status: 500})
    }
}




export async function PATCH(req: Request) {
  try {
    await mongooseConnect();

    const {selectedOrders, status} = await req.json();
    const orderId = new URL(req.url).searchParams.get('id');

    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json({ error: "ID non valide" }, { status: 400 });
      }
      await Order.findByIdAndUpdate(orderId, {status: status}, {new: true});
    } else {
      if (selectedOrders[0] === "All") {
            await Order.updateMany({}, {status: status})
      } else {
        console.log(selectedOrders)
        await Order.updateMany({ _id: { $in: selectedOrders } }, {status: status}, {new: true});
      }
    }

    return NextResponse.json({message: "Mise a jour des commande avec succés!"}, {status: 200})

  } catch (err) {
    console.error(err);
    return NextResponse.json({message: "Echec de mise a jour des commandes!"}, {status: 500})
  }
}