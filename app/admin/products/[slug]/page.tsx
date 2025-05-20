import ProductForm from "@/components/ProductForm";
import axios from "axios";

async function ModifyProduct({params}: {params: {slug: string}}) {
    
    const {slug} = params

    let product, categories;
    try {
        product = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?id=${slug}`)).data.products;
        categories = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)).data;
    
    } catch (err) {
        console.error('error:', err)
    }
    return <ProductForm _id={slug}
    existingName={product.name}
    existingribbon={product.ribbon}
    existingPrice={product.price}
    existingDiscountedPrice={product.discountedPrice}
    existingCategory={product.category}
    existingStock={product.stock}
    existingImageUrl={product.imageUrl}
    categories={categories}
/>;
    
}

export default ModifyProduct;