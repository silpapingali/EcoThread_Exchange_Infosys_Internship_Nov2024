import React from 'react';
import styles from './styles.module.css';

const Filter = ({ tradesFilter, setTradesFilter, dateFilter, setDateFilter }) => {
  const handleTradesChange = (e) => {
    setTradesFilter(parseInt(e.target.value));
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <h3>Filters</h3>

      <div className={styles.filterSection}>
        <h4>Trades greater than</h4>
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={tradesFilter}
            onChange={handleTradesChange}
            className={styles.slider}
          />
          <span className={styles.sliderValue}>{tradesFilter}+</span>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>Posted After</h4>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className={styles.dateInput}
        />
      </div>
    </div>
  );
};

export default Filter;