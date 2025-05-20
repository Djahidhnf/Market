"use client";


function Pagination({currentPage, totalPages, setCurrentPage}: {currentPage: number, totalPages: number, setCurrentPage: (i: number) => void}) {

  

  return (
    <div className="flex justify-center gap-x-3 mt-20">
      <button
        className="bg-secondary-500 rounded-lg hover:text-white
        flex justify-center items-center
        disabled:bg-gray-400 disabled:text-gray-800
        size-10 cursor-pointer"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage( currentPage - 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
        </svg>
      </button>

      {Array.from({length: totalPages}, (_, i) => (
        <button key={i} onClick={() => setCurrentPage( i + 1)}
        className={`bg-secondary-500 rounded-lg hover:text-white text-center size-10
        ${currentPage === i + 1? 'bg-black text-white' : ''}`}>
          {i + 1}
        </button>
      ))}


      <button
        className="bg-secondary-500 border-2 border-secondary-500 rounded-lg hover:text-white
        flex justify-center items-center
        disabled:bg-gray-400 disabled:text-gray-800
        size-10 cursor-pointer"
        disabled={totalPages - currentPage === 0}
        onClick={() => setCurrentPage( currentPage + 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
        >
          <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
        </svg>
      </button>
    </div>
  );
}

export default Pagination;

