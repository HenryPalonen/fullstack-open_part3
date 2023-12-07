import React from 'react';

const Filter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filterValue} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter;
