"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CategoriesMoreButton({ categoryId, isOpen, onToggle}: { categoryId: string, isOpen: boolean, onToggle: () => void}) {
  const router = useRouter();


  function handleClick(e: { stopPropagation: () => void }) {
    e.stopPropagation();
    onToggle();
  }

  async function handleDelete() {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?id=${categoryId}`
      );
      router.push("/admin/categories");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <>
      <button
        className="text-white rounded-full hover:bg-white/50 hover:text-black
                flex justify-center items-center m-2 size-10 absolute right-0"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
        >
          <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="bg-white rounded-md w-50 py-3 absolute z-10 right-12 top-[-25px] shadow-[0px_0px_38px_-12px_#0026ff]">
          <ul>
            <li>
              <Link
                href={`/api/categories/${categoryId}`}
                className="flex gap-x-2 py-1 px-3 hover:bg-blue-700/10 hover:text-blue-700"
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

export default CategoriesMoreButton;
