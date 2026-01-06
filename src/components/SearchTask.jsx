import React from 'react';

function SearchTask({ searchTerm, setSearchTerm }) {

  return (
      <input type="text" placeholder="Search tasks..." 
      className="border border-gray-300 rounded-lg p-2 w-full mb-4"
      value={searchTerm}
      onChange={ (e) => {
        setSearchTerm(e.target.value);
      }}
      />
  );
}

export default SearchTask;
