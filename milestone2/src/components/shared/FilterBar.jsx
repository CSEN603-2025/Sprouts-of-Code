import React from 'react';
import './FilterBar.css';

const FilterBar = ({ 
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterOptions = [],
  activeFilter,
  onFilterChange,
  showSearch = true
}) => {
  return (
    <div className="filters-container">
      {showSearch && (
        <div className="search-container">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="search-input"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
      <div className="status-filters">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`status-filter ${activeFilter === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar; 