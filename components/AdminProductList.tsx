"use client";

import Link from "next/link";
import Image from "next/image";
import ProductsMorebutton from "./ProductsMoreButton";
import { IProduct } from "@/models/Product";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTint } from "@/context/TintContext";
import AdminProductFilter from "./AdminProductFitler";
import { ICategory } from "@/models/Category";
import toast from "react-hot-toast";


function AdminProductList({ products, categories }: {products: IProduct[], categories: ICategory[]}) {
  const router = useRouter();

  const { setTint } = useTint();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  
  const [clicked, setClicked] = useState(false);

  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const [selectedData, setSelectedData] = useState<string[] >([])

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    ribbon: [],
    searchQuery: "",
    stock: null,
  })


  const filteredProducts = products.filter(item => {
    // const stockFilterValid = filters.stock !== "" && !isNaN(Number(filters.stock))
    return (
      (filters.searchQuery === "" || item.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
      (filters.categories.length === 0 || filters.categories.includes(item.category._id) ) &&
      (filters.ribbon.length === 0 || filters.ribbon.includes(item.ribbon)) &&
      (filters.stock === null || item.stock <= filters.stock)
    )
  })

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { type, checked, name, value } = e.target;
  
    setFilters(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
        : name === "stock"
          ? value === "" ? null : Number(value) // ✅ convert empty to null
          : value,
    }));

  }
  





  function handleSelectedData(event: React.ChangeEvent<HTMLInputElement>) {
    const id = event.target.value;
    if (id === "All" && selectedData.includes("All")) {
      setSelectedData([])
      return
    } else if (id === "All") {
      setSelectedData(["All"])
      return
    }

    if (selectedData.includes(id)) {
      const updated = selectedData.filter(item => item !== id)
      setSelectedData(updated)
    } else {
      setSelectedData(prev => [...prev, id])
    }
  }


  async function handleDeleteProducts() {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {data:{selectedData: selectedData}})
    router.refresh();
    toast.success("Produits supprimé avec success !", {
      position: "top-center"
    })
    setSelectedData([])
  }


  useEffect(() => {
    function handleWindowClick() {
      setActiveProductId(null);
      setClicked(false);
      setTint(false);
      setDeleteOpen(false)
    }
  
    window.addEventListener("click", handleWindowClick);
  
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }); // Dependency array ensures it updates correctly
  
  
    

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }


  async function handleUpload() {
    if (!file) return toast.success('Veuillez selection un fichier dabord!', {
      duration: 5000,
      style: {
        color: '#4e8da6',
      },
      icon: '❕',
      iconTheme: {
        primary: '#4e8da6',
        secondary: "#223459"
      },
      position: "top-center"
    })
    
    setUploading(true)
    const formData = new FormData();
    formData.append("file", file);
    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/files`, formData);
      setUploading(false);
      
      if (res.data.message) {
        router.refresh();
        setClicked(false)
        setTint(false)

        toast.success("Fichier CSV téléchargé avec succés !", {
          position: "top-center"
        })
      } else {
        console.log(res)
      }
    } catch (err) {
      setUploading(false)
      setFile(null)
      if (err.response && err.response.data) {
        toast.error(`${err.response.data.error}`)
        console.log("Details:", err.response.data.details);
      } else {
        toast.error(`${err.response.data.details}`)
        console.error(err);
      }}
  }

  return (
    <>
      <h1 className="text-4xl font-medium">Produits</h1>

      <div className="flex gap-5 my-5">
        <div className="bg-white rounded-lg w-70 h-30">
          <h1 className="text-2xl font-medium text-center py-2">Produits</h1>
          <h1 className="text-6xl text-center text-secondary-500 font-semibold">
            {products.length}
          </h1>
        </div>
        <div className="bg-white rounded-lg w-70 h-30">
          <h1 className="text-2xl font-medium text-center py-2">Nouveautés</h1>
          <h1 className="text-6xl text-center text-secondary-500 font-semibold">
            {
              products.filter((product) => product.ribbon === "Nouveautés")
                .length
            }
          </h1>
        </div>
        <div className="bg-white rounded-lg w-70 h-30">
          <h1 className="text-2xl font-medium text-center py-2">Promotion</h1>
          <h1 className="text-6xl text-center text-secondary-500 font-semibold">
            {
              products.filter((product) => product.ribbon === "Promotions")
                .length
            }
          </h1>
        </div>
      </div>

      {/* //! add/import buttons */}
      <div className="flex justify-between py-2">
        <Link href="/admin/products/new-product">
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

        {/* //! import button */}
          <button
            className="hover:bg-accent/50 hover:text-white rounded-lg
                    flex justify-center items-center
                    w-15 h-15"
            onClick={(e)=> {
              e.stopPropagation();
              setTint(true)
              setClicked(true)}}>
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

            {clicked && 
              <div className="bg-white rounded-lg fixed z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-170 h-120"
              onClick={(e) => e.stopPropagation()}>
                <div className="bg-accent text-white rounded-t-lg flex justify-between p-5">
                  <h1 className="text-2xl font-medium w-full text-center">Importer des produits</h1>
                  <button className="hover:bg-white/30 rounded-full size-8 flex justify-center items-center"
                    onClick={() => {
                      setTint(false)
                      setClicked(false)
                      setFile(null)
        
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                  </button>
                </div>


                <div className="p-5 h-100 text-xl flex flex-col justify-between">
                  <div>
                    <p>Importer des produits depuis un fichier CSV dans ce format:</p>
                    
                    <div className="bg-gray-600 w-full my-5 text-white text-base font-mono p-2">
                        <p>name,ribbon,category,price,discountedPrice,stock,imageUrl</p>
                        <p>Milka,Promotions,Chocolats,450,400,150,image1.jpg</p>
                        <p>Prime,Nouveautés,Boissons,1100,,53,image2.jpeg</p>
                    </div>
                  

                    
                      <label className={`border-dashed border-3 bg-secondary-200/20 border-accent/90 rounded-lg text-gray-700 h-20 w-full flex justify-center items-center cursor-pointer`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="currentColor"><path d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM13 12V8H11V12H8L12 16L16 12H13Z"></path></svg>
                        <p>{file? "1 Fichier selectioné": "Clicker pour importer un fichier"}</p>
                        <input type="file" name="csvFile" accept=".csv" className="bg-secondary-500/30 rounded-md w-full h-50 cursor-pointer hidden"
                        onChange={handleFileChange}/>

                      </label>
                      </div>

                    <div className="flex gap-x-5">
                      <button className="bg-secondary-500 hover:bg-secondary-200 text-white w-35 h-10 rounded-md p-2 text-center" onClick={handleUpload}>
                        {uploading? "patienter..." : "Importer"}
                      </button>
                      <button className="text-secondary-500" onClick={(e) => {
                        setTint(false)
                        setClicked(false)
                        setFile(null)
                        e.stopPropagation();
                      }}>Annuler</button>
                    </div>
                    
                </div>
              </div>
            }
            
              
      </div>

      {/* //! products list */}
      <div className="bg-white h-12 flex items-center justify-between px-5 rounded-t-lg w-[99.6%]">
          <div className="flex gap-x-6">
            
          
            {selectedData.length !== 0 && 
            <>
              <button className="bg-gray-200 border-1 border-gray-200 hover:border-1 hover:border-secondary-500 hover:bg-transparent text-secondary-500 rounded-full h-8 px-2 flex justify-center items-center gap-x-3 text-xl"
              onClick={(e) => {
                e.stopPropagation();
                setTint(true);
                setDeleteOpen(true)
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                Supprimer
              </button>

              <p className="flex items-center">{selectedData.includes('All')? filteredProducts.length : selectedData.length} de {filteredProducts.length} selectioné</p>

              {deleteOpen && 
              <div className="bg-white rounded-lg w-120 h-60 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                  <div className="bg-accent rounded-t-lg text-white text-2xl text-center font-semibold h-12 px-2 flex items-center justify-between">
                    <h1 className="w-full">Supprimer {selectedData.length} produits?</h1>
                    <button className="size-8 hover:bg-white/30 rounded-full flex justify-center items-center"
                    onClick={() => {
                      setTint(false);
                      setDeleteOpen(false)
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                  </div>
                  <div className="h-40 px-5 mt-5 flex flex-col justify-between">
                    <h1 className="text-2xl">Une fois supprimés, vous ne pourrez plus récupérer ces produits.</h1>

                    <div className="flex gap-x-3">
                      <button className="hover:bg-red-600 border-1 border-red-500 rounded-md text-red-700 hover:text-white h-10 px-2"
                      onClick={() => {
                        setTint(false);
                        setDeleteOpen(false)
                      }}>Annuler</button>
                      <button className="bg-red-500 border-1 hover:bg-red-600 border-red-500 rounded-md text-white h-10 px-2"
                      onClick={handleDeleteProducts}>Supprimer</button>
                    </div>
                  </div>
              </div>
              }
              
            </> || 
            <>
              <AdminProductFilter categories={categories} handleChange={handleFilterChange} filters={filters}/>
              <p className="text-xl text-secondary-500 flex items-center">{filteredProducts.length} produits</p>
          </>}
          </div>

            {selectedData.length === 0 && 
            <input type="search" name="searchQuery" placeholder="Rechercher..." className="bg-gray-200 border-1 border-secondary-500 rounded-full h-8 px-3"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={handleFilterChange}/>
          }
        </div>
      <div className=" rounded-b-lg h-120 overflow-y-scroll custom-scrollbar mb-5">
        
        <table className="bg-white rounded-b-lg w-full border-collapse text-left">
          <thead className="h-12 bg-secondary-500 text-white sticky top-0 z-20">
            <tr>
              <th className="pl-5">
                <input
                  type="checkbox"
                  name="SelectAll"
                  value="All"
                  className="w-4 h-4 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleSelectedData}
                />
              </th>
              <th className="w-13"></th>
              <th className="pl-5">Nom</th>
              <th>Inventair</th>
              <th>Prix</th>
              <th>Category</th>
              <th>Ruban</th>
              <th className="w-15"></th>
            </tr>
          </thead>
          <tbody className="text-xl">
            { filteredProducts.length > 0 && filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-secondary-500/20 cursor-pointer h-15 border-b-1 border-gray-300"
                onClick={() => router.push(`/admin/products/${product._id}`)}
              >
                <td className="w-fit pl-5">
                  <input
                    type="checkbox"
                    name="select"
                    value={product._id}
                    className="w-4 h-4 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleSelectedData}
                    checked={selectedData.includes(product._id) || selectedData.includes("All")}
                  />
                </td>
                <td className="relative">
                    <Image src={product.imageUrl || "/images/no-image.png"} alt="" fill className="object-cover py-1" />
                </td>
                <td className="pl-5">{product.name}</td>
                <td>{product.stock}</td>
                <td>
                  {product.discountedPrice != ""? (
                    <>
                      <p className="text-gray-600 text-sm line-through">
                        {product.price} DA
                      </p>
                      <p>
                        {product.discountedPrice} DA
                      </p>
                    </>
                  ) : <p>{product.price} DA</p>}
                </td>
                <td>
                  {product.category!.name || ""}
                </td>
                <td>{product.ribbon}</td>
                <td className="relative w-15">
                  <ProductsMorebutton
                  id={product._id}
                  isOpen={activeProductId === product._id}
                  onToggle={() => {
                    setActiveProductId(prev => (prev === product._id? null : product._id));
                  }}/>
                </td>
              </tr>
            )) || 
            <tr>
              <td colSpan={7} className="h-12 text-center">Aucun produit </td>
            </tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminProductList;
