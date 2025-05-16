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
        <select
          className="filter-dropdown"
          value={activeFilter}
          onChange={e => onFilterChange(e.target.value)}
          aria-label="Filter options"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar; 