"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Product from "@/models/Product";


type SideBarCarProp = {
  handleClick: () => void;
  
};



function SideBarCart({ handleClick }: SideBarCarProp) {

  const {cart, removeFromCart, getCartTotal, validateCart, increaseItem, decreaseItem} = useCart();
  



  function caculatePercentage(oldPrice: number, currentPrice: number): number {
    const val = Math.floor(((oldPrice - currentPrice) / oldPrice) * 100);
    return val;
  }
  

  useEffect(() => {
    validateCart();
  },[]);


  return (
    <div
      className="bg-white/70 sm:bg-white/75 backdrop-blur-sm
    h-full w-full sm:w-90 
    fixed z-20 right-0 top-0
    mt-20
    flex flex-col products-center "
    >
      <div className="relative flex w-full pl-5 pt-5 pb-2">
        <svg
          className=" hover:fill-white hover:stroke-black cursor-pointer"
          onClick={handleClick}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="currentColor"
        >
          <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
        </svg>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-center text-3xl font-semibold">
          Mon Panier
        </h2>
      </div>
  

      <div className="h-full overflow-y-scroll custom-scrollbar px-2">
        {cart.length != 0 && cart.map(item => (
          <div key={item.id} className="bg-accent/10 rounded-md flex justify-between h-35  mb-5">
          <div className="flex">
            <div className="w-30 h-35 relative mr-2">
              <Image src={item.imageUrl || '/images/no-image.png'} alt={item.name} sizes="10vw" fill className="object-cover rounded-l-md"/>
              {item.stock === 0 &&
              <div className="bg-gray-600/80 absolute top-8">
                  <h1 className="text-center text-white font-semibold text-xl">En Rupture de stock</h1>
              </div>
              }
            </div>
            <div className="flex flex-col justify-between">
              <h4 className="text-xl font-semibold">{item.name}</h4>
              {item.discounted != "" ? 
              (<>
                <p className="text-gray-700 line-through">{item.price} DA</p>
                <p className="text-secondary-500 text-xl font-semibold">{item.quantity}x {parseInt(item.discounted)} DA</p>
              </>) : (<p className="text-secondary-500 text-xl font-semibold">{item.quantity}x {parseInt(item.price)} DA</p>)}

              <div className="border-1 border-accent rounded-md h-10 w-36 flex">
                <button className="w-12 h-10 flex justify-center items-center hover:text-white hover:bg-accent/50 rounded-l-md"
                onClick={() => decreaseItem(item.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 11V13H19V11H5Z"></path></svg></button>
                <div className="w-12 h-10 flex justify-center items-center text-xl">
                  ({item.quantity})
                </div>
                <button className="w-12 h-10 flex justify-center items-center hover:text-white hover:bg-accent/50 rounded-r-md"
                onClick={() => increaseItem(item.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg></button>
              </div>
            </div>
          </div>

            
          <div>
            <button className=" hover:text-white" onClick={() => removeFromCart(item.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
            </button>
          </div>
      </div>
        )) || <h1 className="text-xl text-center my-10">Panier est vide</h1>}
      </div>
      

      <div className="w-full flex flex-col gap-y-5 pb-25 mt-2 justify-self-end">
        <div className="px-5 text-xl font-semibold flex justify-between">
          <p>Sous-Total:</p>
          <p className="text-secondary-500">{getCartTotal()} DA</p>
        </div>
        <button
          className="bg-green-800 rounded-md text-white w-50 h-10 hover:bg-green-600
        self-center"
        onClick={handleClick}>
          <Link href="/payment" className="w-full h-full flex items-center justify-center">Commander</Link>
        </button>
      </div>
    </div>
  );
}

export default SideBarCart;
