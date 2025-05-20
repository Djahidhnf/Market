import { Schema, model, models, Types } from "mongoose";
import Product from "@/models/Product";


interface IOrderProduct {
    id: Types.ObjectId;
    name: string,
    price: string,
    quantity: number;
}

export interface IOrder {
    _id: string;
    name: string;
    phone: string;
    address: string;
    products: IOrderProduct[];
    status: boolean;
    total: string;
}

const OrderSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    products: [
      {
        _id: {type: Types.ObjectId, ref: "Product", required: true},
        name: {type: String, required: true},
        price: {type: String, required: true},
        quantity: {type: Number, required: true},
      },
    ],
    status: { type: Boolean, default: false },
    total: { type: String, required: true },
  }, { timestamps: true });

export default models.Order || model("Order", OrderSchema);
