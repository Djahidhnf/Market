'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";

function Banner() {

    const router = useRouter();



    return (
        <div className="bg-[url(/images/bg-banner-2.png)] bg-cover bg-center  h-140 pr-2 pt-40 md:px-15 lg:px-30">
            <h1 className="text-4xl text-center md:text-left font-bold text-white md:text-7xl mb-5 ">Bienvenue chez<br />Market</h1>
            <div className="md:block flex justify-center">
                <button className="banner-btn bg-green-600 hover:bg-green-700 text-white rounded-sm p-3"
                onClick={() => router.push('/store')}>Nos Produits</button>
            </div>
        </div>  
    )

}


export default Banner;