import axios from "axios";

async function Dashboard() {
    
    let productsCount;
    let categoriesCount;
    let ordersCount;
        try {
            productsCount = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)).data.products.length
            categoriesCount = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)).data.length
            ordersCount = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`)).data.length
        } catch (err) {
            console.error('error:', err)
        }
    
    return (
        <>
            <h1 className="text-4xl">Bienvenue, <span className="font-medium">{process.env.ADMIN_NAME}</span></h1>

            <h1 className="text-4xl  mt-13">Statistiques</h1>
            <div className="flex gap-5 mt-5">
                <div className="bg-white rounded-lg w-70 h-40">
                    <h1 className="text-2xl font-medium text-center py-2">Total Produits</h1>
                    <h1 className="text-6xl text-center text-secondary-500 font-semibold">{productsCount}</h1>
                </div>
                <div className="bg-white rounded-lg w-70 h-40">
                    <h1 className="text-2xl font-medium text-center py-2">Total Categories</h1>
                    <h1 className="text-6xl text-center text-secondary-500 font-semibold">{categoriesCount}</h1>
                </div>
                <div className="bg-white rounded-lg w-70 h-40">
                    <h1 className="text-2xl font-medium text-center py-2">Total Commandes</h1>
                    <h1 className="text-6xl text-center text-secondary-500 font-semibold">{ordersCount}</h1>
                </div>
            </div>

        </>
    )
}


export default Dashboard;