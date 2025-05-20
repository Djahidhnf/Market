import { NextResponse } from "next/server";
import { parse } from "papaparse";
import multer from "multer";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";



//configure multer for file upload
const upload = multer({storage: multer.memoryStorage()});


export async function POST(req: Request) {
    try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

  
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
  
      // Read file as text
      const text = await file.text();
  
      // Parse CSV
      const { data } = parse(text, {
        header: true,
        skipEmptyLines: true,
      });
  
      if (!data.length) {
        return NextResponse.json({ error: "CSV file is empty" }, { status: 400 });
      }
  
      await mongooseConnect();
  
      const products = data.map((row: any) => ({
        name: row.name,
        ribbon: row.ribbon,
        category: row.category || null,
        price: row.price,
        discountedPrice: row.discountedPrice,
        stock: row.stock,
        imageUrl: row.imageUrl || "",
      }));
  
      // Fetch existing categories
      const categories = await Category.find();
  
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          let category = categories.find((cat) => cat.name === product.category);
  
          if (!category && product.category) {
            category = await Category.create({ name: product.category });
          }
  
          return {
            ...product,
            category: category ? category._id : null, // Assign category ID
          };
        })
      );
  
      //   Insert products into database
      await Product.insertMany(updatedProducts);
      
      
      return NextResponse.json({message: "Data télécharger avec succés!"})

    } catch (err) {
        return NextResponse.json({error: "Format du fichier ou des données non valide. Vérifiez le format et les données, puis réessayez.", details: err}, {status: 400})
    }
}



