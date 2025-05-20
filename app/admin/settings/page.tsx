'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


function Settings() {

    const router = useRouter();


    async function handleLogout() {
        try {
            const res = await axios.post("/api/hash/admin/logout", {}, { withCredentials: true });
            router.push("/admin");
        } catch (error) {
            toast.error("Une erreur est survenue lors de la déconnexion.", {
                duration: 4000,
            });
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-semibold">Settings</h1>

            <h2 className="text-2xl font-semibold mt-10 mb-2">General</h2>
            <div className="bg-gray-200 rounded-lg p-3">
                <h1 className="text-xl font-semibold">Nom d&apos;utilisateur</h1>
                <p>CityMarket</p>

                <button className="bg-accent hover:bg-secondary-500 text-white rounded-md h-8 w-30 px-3 mt-10"
                onClick={handleLogout}>Deconnecter</button>
            </div>
        </div>
    )
}



export default Settings;