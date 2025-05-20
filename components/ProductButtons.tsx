'use client'
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { IProduct } from "@/models/Product";

function ProductButtons({product} : {product: IProduct}) {


    const [quantity, setQuantity] = useState(1)
    const {addToCart} = useCart();
    

    function handlePlusClick() {
        if (product.stock && quantity < parseInt(product.stock)) setQuantity(quantity + 1);
    }
    
    function handleMinusClick() {
        if (quantity > 1) setQuantity(quantity - 1);
    }


return (
    <div
            className="flex items-center gap-x-1
        text-2xl"
          >
            <button
              className="flex justify-center items-center
            border-2 border-gray-800 rounded-md hover:bg-gray-300
            w-10 h-10"
            onClick={handleMinusClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="currentColor"
              >
                <path d="M5 11V13H19V11H5Z"></path>
              </svg>
            </button>
            <div
              className="flex justify-center items-center
            border-2 border-gray-800 rounded-md 
            w-10 h-10
            my-5"
            >
              {quantity}
            </div>
            <button
              className="flex justify-center items-center
            border-2 border-gray-800 rounded-md hover:bg-gray-300
            w-10 h-10"
            onClick={handlePlusClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="currentColor"
              >
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
              </svg>
            </button>

            <button
              className="bg-secondary-500 hover:bg-secondary-500/90 rounded-sm
            text-white overflow-hidden
            w-40 h-10 md:w-fit md:px-2
            ml-1"
            disabled={product.stock === "0"}
            onClick={() => addToCart({id: product._id, name: product.name, imageUrl: product.imageUrl, quantity: quantity, price: product.price, discounted: product.discountedPrice, stock: product.stock})}
            >
              AJOUTER AU PANIER
            </button>
          </div>
)


}


export default ProductButtons;
