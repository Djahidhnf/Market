import { ICategory } from "@/models/Category";
import { useEffect, useState } from "react";

function AdminProductFilter({categories, handleChange, filters}: {categories: ICategory[], handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) {

    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        window.addEventListener('click', () => setFiltersOpen(false))

        return () => {
            window.removeEventListener('click', () => setFiltersOpen(false))
        }
    }, [])


    return (
        <>
            <button className="bg-gray-200 border-1 border-gray-200 hover:bg-transparent hover:border-secondary-500 hover:border-1 text-secondary-500 text-xl rounded-full h-8 px-3 flex items-center justify-center gap-x-2"
            onClick={(e) => {
              e.stopPropagation();
              setFiltersOpen(prev => !prev)
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 4V6H20L15 13.5V22H9V13.5L4 6H3V4H21ZM6.4037 6L11 12.8944V20H13V12.8944L17.5963 6H6.4037Z"></path></svg>
              Filter
            </button>


            {filtersOpen &&
              <div className="bg-white w-90 h-screen fixed z-40 right-0 top-0 shadow-[-9px_0px_8px_-4px_rgba(50,_50,_93,_0.25)] flex flex-col justify-evenly px-5 text-xl" onClick={(e) => {e.stopPropagation()}}>
                <div className="">
                  <h1 className="text-2xl font-semibold">Cateogries</h1>
                  <ul className="max-h-70 overflow-y-scroll custom-scrollbar">
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <input onChange={handleChange} type="checkbox" value={cat._id} name="categories" checked={filters.categories.includes(cat._id)}/>
                      <label htmlFor="checkbox" className="ml-2">{cat.name}</label>
                    </li>
                  ))}
                  </ul>
                </div>

                <div>
                  <h1 className="text-2xl font-semibold">Ruban</h1>
                  <ul>
                    <li>
                      <input onChange={handleChange} type="checkbox" value="Nouveautés" name="ribbon" checked={filters.ribbon.includes("Nouveautés")}/>
                      <label htmlFor="checkbox" className="ml-2">Nouveautés</label>
                    </li>
                    <li>
                      <input onChange={handleChange} type="checkbox" value="Promotions" name="ribbon" checked={filters.ribbon.includes("Promotions")}/>
                      <label htmlFor="checkbox" className="ml-2">Promotions</label>
                    </li>
                  </ul>
                </div>

                <div>
                  <h1 className="text-2xl font-semibold">Inventair</h1>
                  <input type="number" name="stock" placeholder="e.i: 10" min={0} step={1} onChange={handleChange}
                  className="border-1 border-blue-300 rounded-md px-2 w-40"/>
                </div>
              </div>
              }
        </>
    )


}




export default AdminProductFilter;