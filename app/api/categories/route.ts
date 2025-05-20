import Category from "@/models/Category"; // ✅ Use absolute path
import { mongooseConnect } from "@/lib/mongoose"; // ✅ Use absolute path
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";



export async function GET(req: Request) {
    try {
        await mongooseConnect();

        const id = new URL(req.url).searchParams.get('id');

        let categories;

        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return NextResponse.json({ error: "ID non valide" }, { status: 400 });
            }
            categories = await Category.findById(id)
        } else {

            categories = await Category.find().sort({name: 1});
        }


        return NextResponse.json(categories)
    } catch (err) {
        return NextResponse.json({error: "Requete des categories echoué"}, {status: 500})
    }
}





export async function POST(req: Request) {

  try {
    await mongooseConnect();
    const {name, products} = await req.json();

    

    //* create a new Category
    const newCategory = new Category({name: name});
    await newCategory.save();

    //* assign cat to selected products
    products.forEach(async (product: string) => {
        await Product.findByIdAndUpdate(product, {category: newCategory._id})
    });

    

    return NextResponse.json({messge: "Category crée avec succès", category: newCategory})

  } catch (err) {
    console.error("Error Posting category", err);
    return NextResponse.json({error: "Echec de creation de la category"})
  }
}


export async function PATCH(req: Request) {
  try {
    await mongooseConnect();
    const {name, products} = await req.json();
    const id = new URL(req.url).searchParams.get('id')

    
    
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Categorie Id non valide" }, { status: 400 });
    }
    
      const updatedCategory = await Category.findByIdAndUpdate(id, {name}, {new: true});
      

      products.forEach(async (product: string) => { 
        await Product.findByIdAndUpdate(product, { category: id }); // ✅ Assign selected category
      });
      
      // Remove unselected products from this category
      await Product.updateMany(
        { category: id, _id: { $nin: products } }, // Products previously in this category but now unchecked
        { $unset: { category: "" } } // ✅ Remove category
      );
      

    if (!updatedCategory)
      return NextResponse.json({error: "Categorie non trouvé"}, {status: 404});

    return NextResponse.json({message: "Categorie modifié avec succès", categories: updatedCategory});

  } catch (err) {
    return NextResponse.json({error: "Echec de mise a jour de la categorie"}, {status: 500})
  }
}






export async function DELETE(req: Request) {
  try {
    await mongooseConnect();

    const id = new URL(req.url).searchParams.get("id");
    if (id)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Categorie ID non valide" }, { status: 400 });
      }


      const result = await Product.updateMany(
        { category: new mongoose.Types.ObjectId(id!)}, // Convert to ObjectId
        { $set: { category: null} } // ✅ Set category to an empty string
      );
      
      const deletedCategory = await Category.findByIdAndDelete(id);


    return NextResponse.json({message: "Categorie supprimé avec succès", Category: deletedCategory})


  } catch (err) {
    console.log(err);
    return NextResponse.json({error: "Echec de supression de la categorie"}, {status: 500});
  }
}