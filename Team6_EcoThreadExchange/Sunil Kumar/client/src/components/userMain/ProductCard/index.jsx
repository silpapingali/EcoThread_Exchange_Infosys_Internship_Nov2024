import React from 'react';
import styles from './styles.module.css';

const ProductCard = ({ title, date, image, preferences }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>Posted: {date}</p>
        <div className={styles.preferences}>
          <h4>Prefer:</h4>
          {preferences.map((pref, index) => (
            <span key={index}>{pref}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;