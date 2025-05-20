import ProductList from "@/components/ProductList";

function categoryPage({params}: {params: {slug: string}}) {

    const name = decodeURIComponent(params.slug as string);
    
    return (
        <div className="relative top-20 pt-20">
            <h1 className="text-6xl font-medium px-5 md:px-15 xl:px-30">{name || 'Tous les produits'}</h1>
            <hr className="text-gray-500 w-[85%] mt-5 mb-10 mx-auto"/>
            <ProductList categoryName={name}/>
        </div>
         
    )
}


export default categoryPage;