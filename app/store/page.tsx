import ProductList from "@/components/ProductList";

async function categoryPage({params, categoryName}: {params: {slug: string}, categoryName?: string}) {


    return (
        <div className="relative top-20 pt-20">
            <h1 className="text-6xl font-medium px-5 md:px-15 xl:px-30">{categoryName || 'Tous les produits'}</h1>
            <hr className="text-gray-500 w-[85%] mt-5 mb-10 mx-auto"/>
            <ProductList />
        </div>
         
    )
}


export default categoryPage;