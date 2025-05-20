import AdminCategoriesList from "@/components/AdminCategoriesList";
import axios from "axios";

async function AdminCategories() {

    let products = [];
    let categories = [];
    try {
        let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        products = res.data.products;
        console.log(products)

        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
        categories = res.data
    } catch (err) {
        console.error('Error:', err)
    }
    
    return (
       <AdminCategoriesList products={products} categories={categories} />
    )


}


export default AdminCategories;