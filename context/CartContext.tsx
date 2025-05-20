import axios from "axios";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";


const CartContext = createContext(undefined);


export function CartProvider({children}: {children: ReactNode}) {
    const [cart, setCart] = useState([]);
    const [cartHash, setCartHash] = useState("")


        //Load cart from localstorage on initial render
        useEffect(() => {
            const savedCart = localStorage.getItem('cart');
            const savedHash = localStorage.getItem('cartHash');
            
            if (savedCart && savedHash) {
                setCart(JSON.parse(savedCart));
                setCartHash(savedHash); // hash is a string, no JSON.parse needed
            }
        }, []);
        
    
    // save cart to localstorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cartHash', cartHash)
    });

    // useEffect(() => {
    //     localStorage.setItem('cartHash', hash)
    // }, [hash])
    
    

    



    async function addToCart(product) {
        let updatedCart;
        setCart(prevCart => {
            const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
    
    
            if (existingProductIndex >= 0) {
                updatedCart = prevCart.map((item, index) => {
                    if (index === existingProductIndex) {
                        const newQuantity = item.quantity + product.quantity;
    
                        // Check if new quantity exceeds stock
                        if (newQuantity > product.stock) {
                            alert(`Vous avez atteint la quantité maximale - ${product.stock} en stock, vous avez déjà ${item.quantity}`);
                            return item; // Return unchanged item
                        }
    
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                });
            } else {
                updatedCart = [...prevCart, { ...product }];
            }

            //! hash the cart and save both the cart and hash
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Store updated cart in localStorage
            return updatedCart;
        });
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hash`, updatedCart)
        setCartHash(res.data.hash);
        localStorage.setItem("cartHash", JSON.stringify(res.data.hash))
    }
    


    async function increaseItem(id: string) {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                if (item.quantity < item.stock) {
                    return { ...item, quantity: item.quantity + 1 }; // ✅ Create a new object
                } else {
                    alert(`Stock limité! Vous ne pouvez pas ajouter plus de ${item.stock}.`);
                }
            }
            return item;
        });

        setCart(updatedCart);

        //! hash updated cart and save here
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hash`, updatedCart);
        setCartHash(res.data.hash)


        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.setItem("cartHash", res.data.hash);
    }



    async function decreaseItem(id: string) {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                if (item.quantity > 1) {
                    return {...item, quantity: item.quantity - 1};
                }
            }
            return item;
        })
        
        //! hash updated cart and save here 
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hash`, updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.setItem("cartHash", res.data.hash);

        setCart(updatedCart);
        setCartHash(res.data.hash)
        

    }
    
    

    async function validateCart () {
        try {
            const products = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)).data.products;
            const updatedCart = cart.map(cartItem => {
                const product = products.find(p => p._id === cartItem.id);

                if (!product) {
                    return null;
                }

                return {
                    ...cartItem,
                    price: product.price,
                    discounted: product.discountedPrice,
                    stock: product.stock,
                    quantity: Math.min(cartItem.quantity, product.stock)
                }
            }).filter(Boolean);

            setCart(updatedCart);

            //! hash updated cart and save
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hash`, updatedCart);
            setCartHash(res.data.hash)

        } catch(err) {
            console.error("Error updating cart:", err);
        }
    }

    

        async function removeFromCart(id: string) {
            let updatedCart = [];
            setCart(prevCart => {
                updatedCart = prevCart.filter(item => item.id !== id);
                localStorage.setItem("cart", JSON.stringify(updatedCart))
                return updatedCart;
            });

            //! hash updated cart and save here
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hash`, updatedCart);
            setCartHash(res.data.hash)
            

            localStorage.setItem("cart", JSON.stringify(updatedCart))
        }


    function getCartLength() {
        return cart.reduce((total, item) => total + item.quantity, 0);
        
    }

    function getCartTotal() {
        return cart.reduce((total, item) => total + item.quantity * (item.discounted !== ''? parseInt(item.discounted) : parseInt(item.price)), 0);
    }


    function emptyCart() {
        setCart([])
        setCartHash("")
        return;
    }


    return (
        <CartContext.Provider value={{cart, cartHash, addToCart, increaseItem, decreaseItem, removeFromCart, getCartLength, getCartTotal, validateCart, emptyCart}}>
            {children}
        </CartContext.Provider>
    )

}


export const useCart = () => useContext(CartContext)