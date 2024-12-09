import React from 'react';
import styles from './styles.module.css';

const ProductList = ({ items }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.productList}>
      {items.map((item, index) => (
        <div key={index} className={styles.productCard}>
          <img src={item.image} alt={item.title} className={styles.productImage} />
          <div className={styles.productInfo}>
            <h3>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.postedBy}>
              Posted by {item.postedBy} on {formatDate(item.date)}
            </p>
            <div className={styles.preferences}>
              <p>Prefer:</p>
              {item.preferences.map((pref, idx) => (
                <span key={idx} className={styles.preference}>{pref}</span>
              ))}
            </div>
            <div className={styles.trades}>
              <span>Trades: {item.trades}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;