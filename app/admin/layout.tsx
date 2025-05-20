"use client";
import { useTint } from "@/context/TintContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/admin';

  const { tint } = useTint();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Produits", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Commandes", href: "/admin/orders" },
    { name: "Utilisateurs", href: "/admin/users" },
    { name: "Paramètres", href: "/admin/settings" },
  ];

  return (
    <section className="min-h-screen">
      {!hideSidebar && (

        <button
        className="hover:text-white rounded-lg lg:hidden m-5"
        onClick={() => setOpen((prev) => !prev)}
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="36"
          height="36"
          fill="currentColor"
          >
          <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
        </svg>
      </button>
      )}

     {open && !hideSidebar && 
        <aside
          className="bg-accent text-white text-2xl font-semibold text-left 
        fixed top-0 left-0 h-screen
        py-5 w-80 lg:block"
        >
          <div className="flex flex-row-reverse m-5">
            <svg className="hover:bg-white/20 rounded-full cursor-pointer size-10 p-1 " onClick={() => setOpen(false)}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path></svg>
          </div>
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-l-md ml-10 mb-8 p-2 cursor-pointer hover:bg-white/30 ${
                  pathname.startsWith(link.href) ? "bg-primary text-accent" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </aside>
      }


{!hideSidebar && !open &&(

  <aside
  className="bg-accent text-white text-2xl font-semibold text-center 
  fixed top-0 left-0 h-screen
        py-5 w-60 hidden lg:block"
      >
        <h2 className="text-3xl">Admin panel</h2>
        <div className="flex flex-col ">
          {links.map((link) => (
            <Link
            key={link.href}
              href={link.href}
              className={`rounded-l-md ml-2 mt-10 p-2 cursor-pointer hover:bg-white/30 ${
                pathname.startsWith(link.href) ? "bg-primary text-accent" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </aside>
)}    
      <main className="lg:ml-60 py-5 px-10">
        {children}
      </main>


      {tint && (
        <div className="bg-black/60 fixed top-0 z-30 w-screen h-screen"></div>
      )}
    </section>
  );
}

export default AdminLayout;
