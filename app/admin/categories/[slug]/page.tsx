import CategoryForm from "@/components/CategoryForm";
import { ICategory } from "@/models/Category";
import axios from "axios";

async function ModifyCategory({params}: {params: {slug: string}}) {
    const {slug} = params

    let res;
    let products;
    let category: ICategory | undefined;
    try {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?id=${slug}`)
        category = res.data

        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        products = res.data.products;

    } catch (err) {
        console.error('error:', err)
    }

    return (
        <CategoryForm category={category} products={products}/>
    )

}


export default ModifyCategory;