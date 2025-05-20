'use client'
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function Admin() {
 
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        password: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hash/admin/login`, formData);

            console.log(res)

            if (res.status === 200) {
                router.push("/admin/dashboard");
                toast.success("Connexion réussie", {
                    duration: 3000,
                    position: "top-left",
                });
            }
            
        } catch (error) {
            toast.error("Mot de passe ou nom d'utilisateur incorrect", {
                duration: 3000,
                position: "top-left",
            });

        }
    }

    return (
        <div className="absolute top-0 left-0 size-full px-10 md:px-15">
            <div className="text-5xl font-bold my-5 text-center flex justify-center items-center text-accent">
                {/* <div className="relative w-10 h-12 md:w-18 md:h-21 mr-3">
                    <Image src="/images/city-market-logo.png" alt="logo" fill className="object-contain"/>
                </div> */}
                <span className="text-4xl sm:text-5xl font-bold">Welcome back</span>
            </div>

            <form className="bg-secondary-500/15 mx-auto w-[100%] sm:w-100 rounded-4xl shadow-xl shadow-accent px-5 md:px-10 py-10"
                onSubmit={handleSubmit}>
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-5 text-primary-dark">Admin</h1>
                <input type="text" name="name" id="" className="bg-gray-100 border-1 border-secondary-200 rounded-md w-[100%] h-10 px-2 mb-5" placeholder="nom d'utilisiteur"
                onChange={handleChange} required/>
                <input type="password" name="password" id="" className="bg-gray-100 border-1 border-secondary-200 rounded-md w-[100%] h-10 px-2" placeholder="mot de passe" onChange={handleChange} required/>

                <button type='submit' className="bg-accent hover:bg-secondary-500 w-full h-10 px-3 text-white font-white rounded-md my-10">Se connecter</button>
            </form>
            
        </div>
    )
}

export default Admin;