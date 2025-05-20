'use client'
import Link from "next/link";
import { ICategory } from "@/models/Category";
import axios from "axios";
import { useState, useEffect } from "react";


function CategoriesLink({isOpen}: {isOpen: boolean}) {

    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error('Error:', err);
            }
        }

        fetchCategories();
    }, []);


    return (
        <>
            {isOpen && 
                <div className="bg-white rounded-lg w-60
                text-black flex flex-col
                fixed z-30 top-15 right-30
                shadow-[0px_0px_10px_0px_#4e8da6]">
                    {categories.map(cat => 
                        <Link key={cat._id} className="hover:text-secondary-500 py-1 px-3  cursor-pointer hover:font-semibold" href={`/store/${cat.name}`}>{cat.name}</Link>
                    )}
                    
                </div>
            }
        </>
    )
}


export default CategoriesLink;