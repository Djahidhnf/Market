"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ProductsMorebutton({
  id,
  isOpen,
  onToggle,
}: {
  id: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();


  function handleClick(e: { stopPropagation: () => void }) {
    e.stopPropagation();
    onToggle();
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?id=${id}`
      );
      router.push("/admin/products");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <>
      <button
        className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
                                flex justify-center items-center
                                size-8"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="currentColor"
        >
          <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="bg-white rounded-md w-50 py-3 absolute z-10 right-17 top-0 shadow-[0px_0px_38px_-12px_#0026ff]">
          <ul>
            <li>
              <Link
                href={`/api/products/${id}`}
                className="flex gap-x-2
                                                    py-1 px-3
                                                    hover:bg-blue-700/10 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >
                  <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                </svg>
                Modifier
              </Link>
            </li>
            <li>
              <button
                className="flex gap-x-2 py-1 px-3 w-full hover:bg-blue-700/10 hover:text-blue-700"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
                Suprimmer
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default ProductsMorebutton;
