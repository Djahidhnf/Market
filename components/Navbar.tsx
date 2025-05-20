'use client'
import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import CategoriesLink from "./CategoriesLink";
import Image from "next/image";



function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        window.addEventListener('click', () => setIsOpen(false))
        return () => {
            window.removeEventListener('click', () => setIsOpen(false))
        }
    }, [])

    return (
        <>
            <nav className="bg-secondary-500 h-20 w-screen
            flex justify-between items-center
            fixed z-30
            px-2 md:px-5 xl:px-30">
                <Menu />
                {/* <h3 className="text-primary text-center font-bold  text-4xl cursor-pointer great-vibes-regular"><Link href="/">El Mercado</Link></h3> */}
                {/* <Image src="/images/fichier 1.png" alt="" width={120} height={90} /> */}
                <h3 className="text-white text-center font-bold text-4xl cursor-pointer"><Link href="/">MARKET</Link></h3>
                <div className="flex gap-x-10 items-center">
                <ul className="text-white text-xl
                hidden xl:flex md:gap-x-5">
                    <li className="hover:text-accent"><Link href='/'>Acceuil</Link></li>
                    <li className={`hover:text-accent cursor-pointer ${isOpen ? 'text-accent' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(prev => !prev)
                        }}>Categories</li>
                        <CategoriesLink isOpen={isOpen} />
                    <li className="hover:text-accent"><Link href='/'>A-propos</Link></li>
                    <li className="hover:text-accent"><Link href='/'>Contact</Link></li>
                </ul>
                {/* <SearchBar /> */}
                    </div>
            </nav>

            
        </>
    )


}


export default Navbar;