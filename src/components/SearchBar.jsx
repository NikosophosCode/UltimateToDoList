/**
 * SearchBar Component
 * Barra de búsqueda con icono de lupa estilizada según el diseño
 */
function SearchBar({ searchTerm, setSearchTerm, placeholder = "Search your Lists" }) {
  return (
    <div className="px-6 mb-6">
      <div className="relative">
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full bg-[#3d2852] text-white placeholder-gray-400 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff6b6b] p-2 rounded-lg hover:bg-[#ff5252] transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
