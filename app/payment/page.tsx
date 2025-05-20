"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";



function Payment() {
   const router = useRouter();

   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      address: "",
   });

   const [processing, setProcessing] = useState(false);


   const {cart, cartHash, removeFromCart, getCartTotal, validateCart, increaseItem, decreaseItem, emptyCart} = useCart();
   const cartTotal = getCartTotal();
   const shipingFee = 0;
   

   useEffect(() => {
      validateCart();
    }, []);


    //* add input change handler
    function handleInputChange(e:React.ChangeEvent<HTMLInputElement>) {
      const {name, value} = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value,
      }))
    }


   async function handlePayment(e: React.FormEvent) {
      e.preventDefault();
      try {
         setProcessing(true);
         const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {formData, cart, cartHash})
         const id = res.data.order._id
      
         emptyCart();
         router.push(`/payment/${id}`);
         toast.success(`${formData.name} ta commande a passés avec succès !`, {
            duration: 5000,
         })
      } catch(err) {
         console.error(err);
      }
   }
   

    return (
            <section className="grid justify-items-center  grid-cols-1 md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-y-5
            relative top-20 z-0
            px-5 lg:px-30 py-10">
                <div className="bg-white rounded-lg w-full md:w-[90%] h-fit p-2
                text-xl">
                    <h1 className="text-4xl font-semibold text-center">Expedition</h1>

                    <div className="mt-10 mb-5">
                        <label htmlFor="name" className="block">Nom & prénom</label>
                        <input type="text" name="name" className="rounded-md  w-[70%] mt-2 px-2
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1
                        text-xl border border-gray-400"
                        required
                        onChange={handleInputChange} />
                     </div>

                     <div className="mb-5">
                        <label htmlFor="address" className="block">Addresse exacte</label>
                        <input type="text" name="address" className="rounded-md  w-full mt-2 px-2
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1
                        text-xl border border-gray-400"
                        required
                        onChange={handleInputChange} />
                     </div>

                     {/* <div className="mb-5">
                        <label htmlFor="city" className="block">Wilaya</label>
                        <select name="city" required className="rounded-md  w-full max-h-30 mt-2 px-2
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1
                        text-xl border border-gray-400" >
                           <option value="31">31 - Oran - وهران</option>
                           <option value="25">31 - Oran - وهران</option>
                        </select>
                     </div> */}

                     {/* <div className="mb-5">
                        <label htmlFor="zone" className="block">Commune</label>
                        <select name="zone" required className="rounded-md  w-full mt-2 px-2
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1
                        text-xl border border-gray-400">
                           <option value="31">senia</option>
                           <option value="25">31 - Oran - وهران</option>
                        </select>
                     </div> */}

                     <div className="mb-5">
                        <label htmlFor="phone" className="block">Numero de telephone</label>
                        <input type="text" name="phone" className="rounded-md  w-full mt-2 px-2
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1
                        text-xl border border-gray-400"
                        required
                        onChange={handleInputChange} />
                     </div>

                     <div className="mb-5">
                        <label htmlFor="note" className="block">Note de commande</label>
                        <textarea name="note" className="rounded-md  w-full h-30 mt-2 px-2
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1
                        text-xl border border-gray-400" />
                     </div>
                     
                    
                </div>

                <div className="bg-white rounded-lg w-full md:w-[90%] h-fit p-2
                text-xl px-5">
                  <h1 className="text-4xl font-semibold text-center">Votre Commande</h1>

                  <div className="my-5">
                     {cart.map(item => (
                                  <div key={item.id} className="bg-accent/10 rounded-md flex justify-between h-35  mb-5">
                                  <div className="flex">
                                    <div className="w-30 h-35 relative mr-2">
                                      <Image src={item.imageUrl || "/images/no-image.png"} alt="product-image" sizes="10vw" fill className="object-cover rounded-l-md"/>
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
                     ))}

                     <div className="flex justify-between text-2xl font-semibold">
                        <h1>Sous-total</h1>
                        <h1 className="text-secondary-500">{cartTotal} DZD</h1>
                     </div>
                     <hr className="my-4 w-[90%] mx-auto"/>
                     <div className="flex justify-between text-2xl font-semibold">
                        <h1>Tarif d&apos;expédition</h1>
                        <h1 className="text-secondary-500">{shipingFee}DZD</h1>
                     </div>
                     <hr className="my-4 w-[90%] mx-auto"/>
                     <div className="flex justify-between text-2xl font-semibold mb-10">
                        <h1>total</h1>
                        <h1 className="text-secondary-500">{shipingFee + cartTotal} DZD</h1>
                     </div>

                     <div>
                        <button className="bg-green-800 rounded-md text-white w-full h-10 hover:bg-green-600"
                        onClick={handlePayment}
                        type="submit"
                        disabled={cart.length === 0 || processing}>
                           {!processing && "Commander" ||
                           <div className="border-4 border-t-white border-gray-400 rounded-full size-8 mx-auto animate-spin"></div>
                           }
                        </button>
                     </div>
                     
                  </div>
                </div>

            </section>
    )
}


export default Payment;