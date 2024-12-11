import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const ProductList = ({ refresh }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [refresh]);

  return (
    <div className={styles.productList}>
      {products.map((product) => (
        <div key={product._id} className={styles.productCard}>
          {product.image && <img src={product.image} alt={product.title} className={styles.productImage} />}
          <div className={styles.productInfo}>
            <h3>{product.title}</h3>

            <div className={styles.sizeCondition}>
              <p className={styles.description}>Size: {product.size}</p>
              <p className={styles.description}>Condition: {product.condition}</p>
            </div>

            <div className={styles.preferencesContainer}>
              <p className={styles.description}>Preferences:</p>
              <div className={styles.preferences}>
                {product.preferences.map((pref, index) => (
                  <span key={index} className={styles.preference}>
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            <p className={styles.postedBy}>
              Posted on: {new Date(product.postedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
