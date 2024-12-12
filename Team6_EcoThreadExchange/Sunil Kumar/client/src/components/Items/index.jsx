import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Filter from './Filter';
import ProductList from './ProductList';
import styles from './styles.module.css';

const Items = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tradesFilter, setTradesFilter] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handleNewItemAdded = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger re-fetch
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate('/new-item')}
          className={styles.addButton}
        >
          Add New Item
        </button>
      </div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className={styles.content}>
        <Filter
          tradesFilter={tradesFilter}
          setTradesFilter={setTradesFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
        {/* Pass search, filters, and refresh to ProductList */}
        <ProductList
          refresh={refresh}
          searchQuery={searchQuery}
          tradesFilter={tradesFilter}
          dateFilter={dateFilter}
        />
      </div>
    </div>
  );
};

export default Items;
