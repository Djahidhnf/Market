'use client'
import Link from "next/link";
import ListButtons from "./ListButton";
import { Suspense, useEffect, useRef, useState } from "react";
import { IProduct } from "@/models/Product";
import { ICategory } from "@/models/Category";
import Image from "next/image";
import axios from "axios";
import Pagination from "./pagination";


const PRODUCT_PER_PAGE = 20;

type ListProp = {
  listName?: string,
  categoryName?: string
  limit?: number
}

function ProductList({listName, categoryName, limit}: ListProp) {


  const [currentPage, setcurrentPage] = useState(1);
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        let res;
        if (listName) {
          res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?type=ribbon&typeVal=${listName}&page=${currentPage}&limit=${limit || 4}`);

        } else if (categoryName) {
          res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?type=category&typeVal=${categoryName}&page=${currentPage}&limit=${limit || 12}`);

        } else {
          res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${currentPage}&limit=${limit || 12}`);
          console.log(res.data)
        }

        setProducts(res.data.products)
        setTotalPages(Math.ceil(res.data.total / (limit? limit : 12)))

        
      } catch(err) {}
    }

    fetchProducts();
  }, [currentPage, limit, listName, categoryName])



  if (products.length === 0) return (
    <div className="flex flex-col items-center px-5 md:px-15 xl:px-30 mb-50">
      {listName && (
        <h1 className="text-4xl md:text-6xl text-center font-semibold my-10">
          {listName}
        </h1>
      )}
      
      <h1 className="text-3xl text-center">Aucun produit disponible</h1>
    </div>
  )

  return (
    <div className="flex flex-col items-center px-5 md:px-15 xl:px-30  mb-20">
      {listName && (
        <h1 className="text-4xl md:text-6xl text-center font-semibold my-10">
          {listName}
        </h1>
      )}

      <Suspense fallback={'Loading...'}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-x-[5%] gap-y-16 w-full">
          {products.map((product: IProduct) => (
            <div key={product._id}
             className=" rounded-md flex flex-col justify-between hover:scale-102">
            <Link href={"/" + product._id}>
              <div className="bg-white relative h-30 md:h-40 lg:h-60 w-full">
                <Image
                  src={product.imageUrl || "/images/no-image.png"}
                  alt=""
                  sizes="100"
                  fill
                  className="mb-10 rounded-t-md object-contain bg-white"
                />
      
                {product.stock === 0 && 
                <div className="bg-gray-500/80
                absolute top-5 md:top-13 lg:top-20
                flex items-center justify-center
                text-center text-2xl font-semibold text-white
                h-20 w-[100%]">
                  <h1>EN RUPTURE DE STOCK</h1>
                </div>}
                  { product.discountedPrice != '' && 
                    <div className="bg-red-600 rounded-2xl
                    text-white text-xl font-semibold text-center
                    absolute z-10 top-[-5px] left-[-8px]
                    w-20 h-8">
                      Promo!
                    </div>
                }
                
              </div>
      
              <h4 className="font-semibold text-2xl text-center">{product.name}</h4>
              <h5 className="text-gray-500 text-xl text-center">{product.category!.name || ""}</h5>
              <div className="flex justify-center gap-4 text-xl">
                {product.discountedPrice != "" && (
                  <>
                    <span className="text-gray-500/90 font-regular text-center line-through">
                      {product.price} da
                    </span>
                    <span className="text-secondary-500 font-semibold text-center">
                      {product.discountedPrice} da
                    </span>
                  </>
                ) || (
                  <span className="text-secondary-500 font-semibold text-center">
                    {product.price} da
                  </span>
                )}
              </div>
            </Link>
      
           
            <ListButtons 
              stock={parseInt(product.stock)}
              id={product._id}
              name={product.name}
              discounted={product.discountedPrice!}
              price={product.price}
              imageUrl={product.imageUrl!}/>
          </div>
          ))}
        </div>
      </Suspense>
          <Pagination
          currentPage={currentPage} 
          totalPages={totalPages}
          setCurrentPage={setcurrentPage} />
    </div>
  );
}

export default ProductList;
