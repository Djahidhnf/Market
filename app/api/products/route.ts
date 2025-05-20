import Product from "@/models/Product"; // ✅ Use absolute path
import { mongooseConnect } from "@/lib/mongoose"; // ✅ Use absolute path
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Category from "@/models/Category";
import jwt from "jsonwebtoken";


export async function GET(req: NextRequest) {
  try {
    await mongooseConnect();

    // Extract query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")

    const type = searchParams.get("type")
    let typeVal = searchParams.get("typeVal")

    if (type === "category") {
      const categories = await Category.find();
      typeVal = categories.filter(cat => cat.name === typeVal? cat._id : "")[0]._id
    }
    


    let products, pagesCount;
    
    if (id) {       //* fetch product by id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "ID non valide" }, { status: 400 });
      }
      
      products = await Product.findById(id);
      
      if (!products) {
        return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
      }


    } else {      //* fetch all products

      const pageParam = searchParams.get("page")
      const limitParam = searchParams.get("limit")
      
      if (pageParam && limitParam) {
        const page = parseInt(pageParam, 10);
        const limit = parseInt(limitParam, 10)
        const skip = (page - 1) * limit;


        products = await Product.find({[type]: typeVal})
          .skip(skip)
          .limit(limit)
          .sort({createdAt: 1})
          .populate("category")

      } else {
        products = await Product.find()
          .sort({name: 1})
          .populate('category')
      }
      pagesCount = await Product.find({[type]: typeVal}).countDocuments();
    }

    return NextResponse.json({message: "Requete des produits réussie", products: products, total: pagesCount}, {status: 200});

  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: "Requete des produit Echoué" }, { status: 500 });
  }
}




export async function POST(req: Request) {

  try {
    await mongooseConnect();
    const body = await req.json();
    
    //* create a new product
    const newProduct = new Product(body);
    await newProduct.save();


    return NextResponse.json({messge: "Produit crée avec succès", product: newProduct})

  } catch (err) {
    console.error("Error Posting products", err);
    return NextResponse.json({error: err})
  }
}




export async function PATCH(req: Request) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const id = new URL(req.url).searchParams.get('id');

    console.log(id, "\n", body);

    if (id)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
      }
    
    const updatedProduct = await Product.findByIdAndUpdate(id , body, {new: true});

    if (!updatedProduct)
      return NextResponse.json({error: "Produits non trouvé"}, {status: 404});

    return NextResponse.json({message: "Produit modifié avec succès", product: updatedProduct});

  } catch (err) {
    return NextResponse.json({error: "Echec de mise a jour du produit"}, {status: 500})
  }
}



export async function DELETE(req: Request) {
  try {
    await mongooseConnect();

    const id = new URL(req.url).searchParams.get("id");
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
      }
      
      await Product.findByIdAndDelete(id);
    } else {
      const {selectedData} = await req.json();
      if (selectedData[0] === "All") {

        await Product.deleteMany({}); // Deletes all products
      } else {
        await Product.deleteMany({ _id: { $in: selectedData } }); // Deletes selected products
      }
      
      }


    return NextResponse.json({message: "Produit supprimé avec succès"})


  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "Echec de supression du prouit"}, {status: 500});
  }
}