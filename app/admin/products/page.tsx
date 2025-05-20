import AdminProductList from "@/components/AdminProductList";
import axios from "axios";



async function AdminProducts() {


    let products = [];
    let categories = [];
    
    try {
        let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        products = res.data.products;
        

        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
        categories = res.data
    } catch (err) {
        console.error('Error:', err)
    }

    return (

        <AdminProductList products={products} categories={categories}/>
    )
    
}


export default AdminProducts;