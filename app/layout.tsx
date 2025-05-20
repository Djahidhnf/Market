'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import BasketIcon from "@/components/CartIcon";
import Navbar from "@/components/Navbar";

import { usePathname } from "next/navigation";
import { TintProvider, useTint } from "@/context/TintContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin")



  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary`}
      >
        <CartProvider>
          <Toaster position="top-left" />
          <TintProvider>
            {!isAdminPage && <Navbar />}  
            {children}
            {!isAdminPage && <BasketIcon />}
            {!isAdminPage && <Footer />}
          </TintProvider>
        </CartProvider>
          
      </body>
    </html>
  );
}

