import CategoryForm from "@/components/CategoryForm"
import axios from "axios"
async function NewCategory() {

    let products = []
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        products = res.data.products
    }catch (err) {
        console.error("Error:", err)
    }


    return (
        <CategoryForm products={products} />
    )

}


export default NewCategory