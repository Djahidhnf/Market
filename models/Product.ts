import { Schema, model, models, Types } from "mongoose";

export interface IProduct {
    _id: string;
    name: string;
    category?: Types.ObjectId | "";
    imageUrl?: string | "";
    price: string;
    discountedPrice?: string | "";
    stock: number | 0;
    ribbon?: "Nouveautés" | "Promotions" | "";
}

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: false, default: "" },
        imageUrl: { type: String, required: false, default: ""},
        price: { type: String, required: true },
        discountedPrice: { type: String, required: false, default: "" },
        stock: { type: Number, required: false, default: 0},
        ribbon: { type: String, enum: ["Nouveautés", "Promotions", ""], required: false, default: ""},
    },
    { 
        timestamps: true
     }
);


export default models.Product || model("Product", ProductSchema);
