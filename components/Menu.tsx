'use client'
import { useState, useEffect } from "react";
import SideBarMenu from "./SideBarMenu";

function Menu() {


    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        window.addEventListener("click", () => setIsOpen(false));

        return () => window.removeEventListener("click", () => setIsOpen(false));
    }, [])


    return (
        <>
            <svg className="fill-white block xl:hidden cursor-pointer"
            onClick={(e) => {
            e.stopPropagation()
            setIsOpen(prev => !prev)}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="rgba(242,198,194,1)"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>

            {isOpen  && <SideBarMenu  handleClick={() => setIsOpen(prev => !prev)}/>}
            
        </>
    )
}


export default Menu;