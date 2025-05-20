"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ICategory } from "@/models/Category";
import Image from "next/image";
import Product from "@/models/Product";

interface ProductType {
    _id?: string
    existingName?: string
    existingribbon?: string
    existingCategory?: string
    existingPrice?: string
    existingDiscountedPrice?: string
    existingStock?: string
    existingImageUrl?: string
    categories: ICategory[]
}

function ProductForm({
    _id,
    existingName,
    existingribbon,
    existingCategory,
    existingPrice,
    existingDiscountedPrice,
    existingStock,
    existingImageUrl,
    categories,
}: ProductType) {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: existingName ?? "",
        ribbon: existingribbon ?? "",
        price: existingPrice ?? "",
        discountedPrice: existingDiscountedPrice ?? "",
        category: existingCategory ?? "",
        stock: existingStock ?? "",
        imageUrl: existingImageUrl ?? "",
    })

    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(formData.imageUrl || null)
    const discount = parseInt(formData.price) - parseInt(formData.discountedPrice)


    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setFilePreview(URL.createObjectURL(event.target.files[0]));
        }
      }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value, type,} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "radio" ? value : value
        }))
        
    }



    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            if (name === "discount") {
                const discountValue = parseFloat(value) || 0;
                const originalPrice = parseFloat(prevData.price) || 0;
                updatedData.discountedPrice = (originalPrice - discountValue).toFixed(2);
            }
            return updatedData;
        });
    }
    

 
    
    


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            let res, imageUrl = existingImageUrl;
            if (_id){
                if (file) {
                    const formDataImg = new FormData();
                    formDataImg.append("file", file);
                    if (file) {
                        const uploadRes = await axios.post(`/api/upload/images`, formDataImg)
                        imageUrl = uploadRes.data.imageUrl;
                    }
                }
                const fullFormData = {...formData, imageUrl};
                res = await axios.patch(`/api/products?id=${_id}`, fullFormData)
            } else {
                if (file) {
                    const formDataImg = new FormData();
                    formDataImg.append("file", file);
                    const uploadRes = await axios.post(`/api/upload/images`, formDataImg)
                    imageUrl = uploadRes.data.imageUrl;
                }
                const fullFormData = {...formData, imageUrl};
                res = await axios.post(`/api/products`, fullFormData)
            }
            
            router.push('/admin/products')
            

        } catch (err) {
            console.error("Error:", err)
        }
    }





    return (


        <form className="grid grid-cols-12 grid-rows-[auto-1fr] gap-x-5" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-semibold col-span-12 mb-5">{_id? "Modifier le produit" : "Nouveau produit"}</h1>
            <div className="col-span-9 flex flex-col gap-10 text-2xl">
                {/* //! image */}
                <div className="bg-white rounded-lg p-5 text-lg">
                    <h1 className="font-semibold text-3xl mb-5">Image</h1>
                    <label className={`relative border-dashed border-3 bg-secondary-200/20 border-accent/90 rounded-lg text-gray-700 size-40 p-3 block text-center cursor-pointer`}>
                        {filePreview == null? 
                            <>
                                <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M14.9968 2L21 8L21.0012 12.2606C20.0501 11.4722 18.8302 11 17.5 11L17.2788 11.0044C14.784 11.103 12.7164 12.8635 12.1523 15.2093L12.136 15.283L12.1068 15.3024C10.8223 16.1634 10 17.6255 10 19.25C10 20.273 10.3242 21.2231 10.8771 22.0006L3.9934 22C3.48412 22 3.06409 21.6171 3.00669 21.1239L3 21.0082V2.9918C3 2.49363 3.38689 2.06546 3.88533 2.00683L4.00221 2H14.9968ZM17.5 13C19.433 13 21 14.567 21 16.5L20.9985 16.6033C22.1531 16.9285 23 17.9903 23 19.25C23 20.7125 21.8583 21.9084 20.4175 21.995L20.25 22H14.75L14.5825 21.995C13.1417 21.9084 12 20.7125 12 19.25C12 17.99 12.8474 16.9279 14.0034 16.6025L14 16.5C14 14.567 15.567 13 17.5 13Z"></path></svg>
                                <p>{file? "1 Fichier selectioné": "Clicker pour importer une image"}</p>
                            </>
                        : <Image
                            src={filePreview}
                            alt="preview"
                            fill
                            sizes="25vw"
                            className="mb-10 rounded-t-md object-contain bg-white"
                            />
                        }
                        <input type="file" name="importCsv" accept="image/*" className="bg-secondary-500/30 rounded-md w-full h-50 cursor-pointer hidden"
                        onChange={handleFileChange}/>
                      </label>
                </div>


                {/* //! Info */}
                <div className="bg-white rounded-lg p-5">
                    <h1 className="font-semibold text-3xl mb-5">Info produit</h1>
                    <div className="flex gap-x-10">
                        <div className="w-[60%]">
                            <label htmlFor="inputName" className="block text-gray-800">Nom</label>
                            <input type="text" name="name" placeholder="Ajouter nom du produit" required onChange={handleChange} value={formData.name}
                                className="block w-full rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl" />
                        </div>

                        <div className="">
                            <label htmlFor="inputRibbon" className="block text-gray-800">Ruban</label>
                            <input type="text" name="ribbon" placeholder="e.g Nouveautés" onChange={handleChange} value={formData.ribbon}
                            className="block w-56 rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl" />
                        </div>
                    </div>
                </div>


                {/* //! Price */}
                <div className="bg-white rounded-lg p-5">
                    <h1 className="font-semibold text-3xl mb-5">Prix</h1> 
                    <div>
                        <div className="w-[30%]">
                            <label htmlFor="price" className="block text-gray-800">Prix</label>
                            <input type="text" name="price" placeholder="DA" required onChange={handleChange} value={formData.price}
                            className="block w-full rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl" />
                        </div>
                    </div>
                    <div className="flex gap-10 mt-10">
                        <div className="w-[30%]">
                            <label htmlFor="discount" className="block text-gray-800">Reduction</label>
                            <input type="text" name="discount" value={discount? discount : ""}  placeholder="DZD" className="block w-full rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl"
                            onChange={handlePriceChange}/>
                        </div>

                        <div className="">
                            <label htmlFor="dicountedPrice" className="block text-gray-800">Prix apres reduction</label>
                            <input type="text" name="discountedPrice" placeholder="DZD" onChange={handleChange} value={formData.discountedPrice}
                            className="block w-56 rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl" />
                        </div>
                    </div>
                </div>

                {/* //! Stock */}
                <div className="bg-white rounded-lg p-5">
                    <h1 className="font-semibold text-3xl mb-5">Inventaire</h1>
                    
                    <div className="flex  gap-x-10">
                        <div className="w-[30%]">
                            <label htmlFor="stock" className="block text-gray-800">Stock</label>
                            <input type="number" name="stock" onChange={handleChange} value={formData.stock}
                            className="block w-full rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl" />
                        </div>
                    </div>
                </div>

                {/* //! save button */}
                <div className="flex flex-row-reverse font-medium gap-x-5">
                    <button className="bg-blue-600 rounded-md hover:bg-blue-500
                                        text-white text-xl 
                                        h-10 w-30 p-2"
                        type="submit">
                        Sauvgarder
                    </button>
                    <button className="bg-white rounded-md hover:bg-blue-500 hover:text-white
                                    text-blue-600 text-xl
                                    h-10 w-25 p-2"
                        type="button">
                        <Link href="/admin/products">Annuler</Link>
                    </button>
                </div>
            </div>


                {/* //! categories */}
                <div className="col-span-3 bg-white rounded-lg h-150 p-5">
                    <h1 className="font-semibold text-3xl mb-5">Categories</h1>
                        <ul>
                            {/* <li>
                                <input type="radio" name="category" value="" className="size-4 mt-2 mr-4 cursor-pointer" 
                                onChange={handleChange}
                                checked={formData.category === ""}/>
                                <h1 className="inline text-xl">Aucune</h1>
                            </li> */}
                            {categories.map(cat => 
                                <li key={cat._id} className="">
                                    <input type="radio" name="category" value={cat._id} className="size-4 mt-2 mr-4 cursor-pointer"
                                    onChange={handleChange}
                                    checked={formData.category === cat._id} required/> 
                                    <h1 className="inline text-xl">{cat.name}</h1>
                                </li>
                    )}
                        </ul>
                </div>
        </form>
    )

}


export default ProductForm;