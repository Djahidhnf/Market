"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";



function ListButtons({stock, id, name, discounted,  price, imageUrl}: {stock: number, id: string, name: string, price: string, discounted: string, imageUrl: string}) {

  const {addToCart} = useCart();


  const [quantity, setquantity] = useState(1);

  function handlePlusClick() {
    if (stock && quantity < stock) setquantity(quantity + 1);
  }

  function handleMinusClick() {
    if (quantity > 1) setquantity(quantity - 1);
  }



  return (
      <div className="flex justify-center mt-5 gap-x-1">
        <button
          className="bg-accent hover:bg-accent/80 rounded-md"
          onClick={handleMinusClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="rgba(255,255,255,1)"
          >
            <path d="M5 11V13H19V11H5Z"></path>
          </svg>
        </button>
        <button className="bg-accent hover:bg-accent/80 rounded-md h-10 w-40 text-white font-semibold text-xs lg:text-xl border-l-1 border-r-1 border-white/30"
          onClick={() => addToCart({id: id, name: name, imageUrl: imageUrl, quantity: quantity, price: price, discounted: discounted, stock: stock})}
          disabled={!stock}>
          Ajouter ({quantity})
        </button>
        <button
          className="bg-accent hover:bg-accent/80 rounded-md"
          onClick={handlePlusClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="rgba(255,255,255,1)"
          >
            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
          </svg>
        </button>
      </div>
  );
}

export default ListButtons;
