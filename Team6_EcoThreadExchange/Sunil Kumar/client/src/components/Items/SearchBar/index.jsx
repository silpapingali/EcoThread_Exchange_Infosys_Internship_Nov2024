import React from 'react';
import styles from './styles.module.css';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <div className={styles.searchIcon}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;