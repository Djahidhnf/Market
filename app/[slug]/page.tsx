import ProductButtons from "@/components/ProductButtons";
import ProductList from "@/components/ProductList";
import axios from "axios";
import Image from "next/image";

interface ProductProp {
  params: { slug: string };
}


async function ProductPage({ params }: ProductProp) {
  function calcPercantage(price: number, discounted: number) {
    const val = Math.round(((price - discounted) / price) * 100);
    return val;
  }

  const { slug } = params;
  let product, category;
  try {
    let res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?id=${slug}`
    );
    product = res.data.products;

    res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?id=${product.category}`
    );
    category = res.data;
  } catch (err) {}

  return (
    <>
      <section
        className="relative top-20
    h-full md:h-screen
    flex flex-col gap-x-10 gap-y-5 md:flex-row md:justify-center md:items-center
    px-10"
      >
        <div
          className="relative
        bg-white rounded-lg
        w-[100%] h-85 md:max-w-120 md:min-h-125
        mt-10 md:mt-0"
        >
          {product.discountedPrice != "" && (
            <div
              className="bg-red-600 rounded-full
          absolute z-5 top-2 left-2
          flex justify-center items-center
          size-15 md:size-20"
            >
              <p className="text-white font-semibold md:text-xl">Promo!</p>
            </div>
          )}

          <Image
            src={product.imageUrl || "/images/no-image.png"}
            alt=""
            fill
            sizes="25vw"
            className="object-contain rounded-lg"
          />

          {product.stock === 0 && (
            <div
              className="bg-gray-500/80
          absolute top-30 md:top-40
          text-3xl md:text-5xl text-white font-semibold text-center
          flex justify-center items-center
          h-25 md:h-50 w-[100%]"
            >
              EN RUPTURE DE STOCK
            </div>
          )}
        </div>

        <div
          className="w-[100%] md:w-120 md:h-125
      text-3xl md:text-5xl"
        >
          <h1 className="text-4xl font-bold md:text-6xl">{product.name}</h1>
          <h1 className="font-semibold text-gray-600 text-3xl mb-5">
            {category.name || ""}
          </h1>
          {(product.discountedPrice != "" && (
            <>
              <p className="text-3xl text-gray-400 line-through">
                {product.price} DA
              </p>
              <p className="font-semibold text-secondary-500 md:text-4xl">
                {product.discountedPrice} DA
              </p>
            </>
          )) || (
            <p className="font-semibold text-secondary-500 md:text-4xl">
              {product.price} DA
            </p>
          )}

          {product.discountedPrice != "" && (
            <p className="text-green-700 text-xl">
              économiser  {calcPercantage(product.price, product.discountedPrice)}%
            </p>
          )}

          <ProductButtons product={product} />
          <hr className="md:my-5" />
          <div
            className="text-2xl text-accent font-medium 
        mt-5 mb-15"
          >
            <p>Produits de qualité</p>
            <p>Livraison rapide</p>
            <p>Payement a la livraison</p>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <h1
          className="text-5xl font-semibold
          px-5 md:px-15 xl:px-30 mb-5 md:mb-10"
        >
          Produits similaires
        </h1>

        <ProductList categoryName={category.name}/>
      </div>
    </>
  );
}

export default ProductPage;
