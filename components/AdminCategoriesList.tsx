"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ICategory } from "@/models/Category";
import { IProduct } from "@/models/Product";
import CategoriesMoreButton from "./CategorisMorebutton";
import { useEffect, useState } from "react";

interface AdminCategoriesListProps {
  products: IProduct[];
  categories: ICategory[];
}

function AdminCategoriesList({
  products,
  categories,
}: AdminCategoriesListProps) {
  const router = useRouter();


  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  function handleToggle(categoryId: string) {
    setActiveCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
  }


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setActiveCategoryId(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <>
      <h1 className="text-4xl font-medium">Categories</h1>

      {/* //! add/import buttons */}
      <div className="flex justify-between py-2">
        <Link href="/admin/categories/new-category">
          <button
            className="hover:bg-accent/50 hover:text-white rounded-lg
                    flex justify-center items-center
                    w-15 h-15"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="currentColor"
            >
              <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
            </svg>
          </button>
        </Link>
        <Link href="#">
          <button
            className="hover:bg-accent/50 hover:text-white rounded-lg
                    flex justify-center items-center
                    w-15 h-15"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="currentColor"
            >
              <path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z"></path>
            </svg>
          </button>
        </Link>
      </div>

      {/* //! product list */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-16 gap-x-5">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-secondary-500 bg-cover bg-center rounded-lg w-full h-40 cursor-pointer
            transition-all duration-[50s] hover:bg-[length:120%] ease-linear"
            onClick={() => router.push(`/admin/categories/${cat._id}`)}
          >
            <div className="w-full h-full rounded-lg backdrop-blur-sm backdrop-grayscale-25">
              <span className="bg-white absolute size-10 rounded-full m-2 flex justify-center items-center text-2xl font-semibold">
                {
                  products.filter((product) => product.category!._id == cat._id)
                    .length
                }
              </span>

              <CategoriesMoreButton 
              categoryId={cat._id}
              isOpen={activeCategoryId === cat._id}
              onToggle={() => handleToggle(cat._id)} />
              
              <p className="text-white text-4xl font-semibold absolute bottom-0 m-2">
                {cat.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminCategoriesList;
