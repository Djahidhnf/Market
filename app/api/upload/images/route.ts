import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "stream";


export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;


    if (!file) {
      return NextResponse.json({ error: "aucune image telechargée!" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "Le roi des friandises/Products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result); // This is the Cloudinary result object
        }
      );

      const readable = Readable.from(buffer);
      readable.pipe(uploadStream);
    });

    console.log(uploadResult);
    return NextResponse.json({ message: "Téléchargement réussi!", imageUrl: uploadResult.secure_url });

  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Image upload failed!", details: err }, { status: 500 });
  }
}
