'use client'
import { ICategory } from "@/models/Category";
import axios from "axios";
import Link from "next/link"
import { useEffect, useState } from "react";


type SideBarMenuProp = {
    handleClick: () => void
}



function SideBarMenu({handleClick}: SideBarMenuProp) {

    const [clicked, setClicked] = useState(false);
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
        <div className="bg-white sm:bg-white/60 sm:backdrop-blur-sm h-full w-full sm:w-90 fixed left-0 top-20">
            
            {/* close button */}
            <div className="flex justify-between">
                {clicked && 
                    <svg className="m-5 hover:fill-white cursor-pointer" onClick={(e) => {e.stopPropagation(); setClicked(false)}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg>
                }

                <svg className="m-5 hover:fill-white cursor-pointer ml-auto" onClick={handleClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
            </div>

            <div className="pl-10 font-semibold text-3xl">
                {!clicked && 
                    <>
                        <h2 className="text-5xl mb-5">Menu</h2>
                        <h5 className=" hover:text-accent"><Link href="/">Acceuil</Link></h5>
                        <h5 className=" hover:text-accent"><Link href="/" onClick={(e) => {e.stopPropagation(); setClicked(prev => !prev)}}>Categories</Link></h5>
                        <h5 className=" hover:text-accent"><Link href="/">A-propos</Link></h5>
                        <h5 className=" hover:text-accent"><Link href="/">Contact</Link></h5>
                    </>
                }
                    {clicked && 
                        <div className="rounded-lg bg-white sm:bg-transparent sm:w-full
                        fixed left-0 top-0 mt-20 z-30 pl-10 h-screen w-screen">
                            <h2 className="text-5xl mb-5">Categories</h2>
                            <div className="flex flex-col overflow-y-scroll custom-scrollbar xl:h-80">
                                {categories.map(cat => (
                                    <Link key={cat._id} href={`/store/${cat.name}`} className="hover:text-accent cursor-pointer">{cat.name}</Link>
                                ))}
                            </div>
                        </div>
                    }
                
            </div>

        </div>


    )

}



export default SideBarMenu;