import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from './SearchBar';
import Filter from './Filter';
import ProductList from './ProductList';
import styles from './styles.module.css';

const Items = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tradesFilter, setTradesFilter] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Memoize the items array
  const items = useMemo(() => [
    {
      title: 'Levis Jeans, 2 Years Old, Good Condition',
      description: '36 Waist, Good Condition',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
      preferences: ['Shoes', 'Jackets', 'Dolls'],
      postedBy: 'You',
      date: '2022-02-12',
      trades: 5000
    },
    {
      title: 'Trunk Box',
      description: '40 in x 23 in, 1930s Model',
      image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80',
      preferences: ['Shoes', 'Art', 'Antiques'],
      postedBy: 'Somnath',
      date: '2023-07-16',
      trades: 2500
    },
    {
      title: 'Trekking Shoes',
      description: 'Size 10 UK, BOBO Brand',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
      preferences: ['Dolls', 'Jeans', 'Shoes'],
      postedBy: 'Kavind',
      date: '2024-03-01',
      trades: 7500
    }
  ], []);

  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const filterDate = new Date(dateFilter);
        return itemDate >= filterDate;
      });
    }

    // Trades filter
    if (tradesFilter > 0) {
      filtered = filtered.filter(item => item.trades >= tradesFilter);
    }

    setFilteredItems(filtered);
  }, [searchQuery, dateFilter, tradesFilter, items]);

  return (
    <div className={styles.container}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className={styles.content}>
        <Filter
          tradesFilter={tradesFilter}
          setTradesFilter={setTradesFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
        <ProductList items={filteredItems} />
      </div>
    </div>
  );
};

export default Items;
