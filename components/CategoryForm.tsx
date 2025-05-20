"use client";

import { IProduct } from "@/models/Product";
import { ICategory } from "@/models/Category";
import { useRouter } from "next/navigation";
import { useTint } from "@/context/TintContext";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductsMoreButton from "./ProductsMoreButton";

function CategoryForm({
  products,
  category,
}: {
  products: IProduct[];
  category?: ICategory;
}) {
  const router = useRouter();

  const { tint, setTint } = useTint();
  // const [activeProductId, setActiveProductId] = useState<string | null>(null);



  //  useEffect(() => {
  //     function handleWindowClick() {
  //       setActiveProductId(null)
  //     }
  
  
  //     window.addEventListener('click', handleWindowClick)
  //     return () => {
  //       window.removeEventListener('click', handleWindowClick)
  //   }
  //   })


  const [formData, setFormData] = useState({
    name: category?.name ?? "",
    products: products
      .filter((product) => product.category === category?._id) // ✅ Keep only matching products
      .map((product) => product._id), // ✅ Extract only _id values
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prev.products, value] // Add if checked
            : prev.products.filter((item) => item !== value) // Remove if unchecked
          : value, // Update name field
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (category) {
        await axios.patch(`/api/categories?id=${category._id}`, formData);
      } else {
        await axios.post(`/api/categories`, formData);
      }

      router.push("/admin/categories");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <h1 className="text-4xl font-semibold">{category ? "Modifier la catégorie" : "Nouvelle category"}</h1>
      <div className="bg-white rounded-lg h-50 p-5 my-5">
        <h1 className="text-3xl font-semibold mb-5">Info Category</h1>

        <label htmlFor="inputName" className="block text-gray-800 text-2xl">
          Nom
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Ajouter nom du produit"
          required
          className="block w-[60%] rounded-md mt-2 py-1.5 px-2 ring-1 ring-inset ring-blue-300 text-xl"
          onChange={handleChange}
        />
      </div>

      {/* //! product list */}
      <div className="rounded-lg min-h-80 max-h-120 overflow-y-scroll custom-scrollbar">
        <table className="bg-white rounded-lg w-full border-collapse">
          <thead className="h-12 bg-secondary-500 text-white sticky top-0 z-20">
            <tr>
              <th className="rounded-tl-lg">
                <input
                  type="checkbox"
                  name="SelectAll"
                  value="All"
                  className="w-4 h-4 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </th>
              <th>Nom</th>
              <th className="rounded-tr-lg w-15"></th>
            </tr>
          </thead>
          <tbody className="text-center text-xl">
            {category &&
              products
                .filter((product) => product.category === category._id)
                .map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-secondary-500/20 cursor-pointer h-15 border-b-1 border-gray-300"
                    onClick={() =>
                      router.push(`/admin/products/${product._id}`)
                    }
                  >
                    <td className="w-fit">
                      <input
                        type="checkbox"
                        name="select"
                        value={product._id}
                        className="w-4 h-4 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>
                      {/* <ProductsMoreButton
                      id={product._id}
                      isOpen={activeProductId === product._id}
                      onToggle={() => {
                        // e.stopPropagation();
                        // setActiveProductId(prev => (prev === product._id ? null : product._id));
                      }}
                      /> */}
                    </td>
                  </tr>
                ))}
            <tr className="h-20">
              <td colSpan={3}>
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full"
                  onClick={() => setTint(true)}
                >
                  +Ajouter Des Produits
                </button>

                {/* //! pop-up */}
                {tint && (
                  <div className="bg-white fixed z-40 top-20 left-1/2 flex flex-col justify-between transform -translate-x-1/2 rounded-lg text-2xl w-130 h-[80%]">
                    <div className="bg-accent rounded-t-lg py-4 text-white flex justify-between px-2">
                      <h1 className="font-semibold">
                        Ajouter des produits a cette category
                      </h1>
                      <button
                        type="button"
                        className="text-white hover:bg-black/10 size-8 p-2 rounded-full flex justify-center items-center"
                        onClick={() => setTint(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                        </svg>
                      </button>
                    </div>

                    <div className="overflow-y-scroll hide-scrollbar">
                      {products.map((product) => (
                        <div
                          key={product._id}
                          className="hover:bg-blue-500/20 flex justify-between items-center px-10 h-12 cursor-pointer"
                        >
                          <h1>{product.name}</h1>
                          <div className="inline-flex items-center">
                            <label className="flex items-center cursor-pointer relative">
                              <input
                                checked={formData.products.includes(
                                  product._id
                                )}
                                type="checkbox"
                                name="products"
                                value={product._id}
                                className="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-secondary-500 checked:bg-secondary-500 checked:border-secondary-500"
                                id="check-custom-style"
                                onChange={handleChange}
                              />
                              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xl flex justify-between p-5">
                      <button
                        type="button"
                        className="text-secondary-500 rounded-full w-25 p-1"
                        onClick={() => setTint(false)}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        className="bg-secondary-500 hover:bg-secondary-200 rounded-full text-white w-25 p-1"
                        onClick={() => setTint(false)}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end font-medium gap-x-5">
        <button
          type="button"
          className="bg-white rounded-md hover:bg-blue-600 hover:text-white
                                    text-blue-600 text-xl
                                    h-10 w-25 p-2"
        >
          <Link href="/admin/categories">Annuler</Link>
        </button>
        <button
          type="submit"
          className="bg-blue-600 rounded-md hover:bg-blue-500
                                        text-white text-xl 
                                        h-10 w-30 p-2"
        >
          Sauvgarder
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
