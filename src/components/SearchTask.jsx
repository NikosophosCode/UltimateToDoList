import React from 'react';

/**
 * SearchTask Component
 * Campo de búsqueda para filtrar tareas
 * Soporta colores de acento dinámicos
 */
function SearchTask({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text" 
        placeholder="Search tasks..." 
        className="w-full bg-card text-primary placeholder-secondary rounded-lg py-2.5 pl-10 pr-4 border border-theme input-accent transition-all duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchTask;
