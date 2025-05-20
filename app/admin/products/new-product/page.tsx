import ProductForm from "@/components/ProductForm";
import axios from "axios";



async function NewProduct() {

    let categories;
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        categories = res.data
    } catch (err) {
        console.error('error:', err);
    }
    return (
        <ProductForm categories={categories}/>
    )

}


export default NewProduct;