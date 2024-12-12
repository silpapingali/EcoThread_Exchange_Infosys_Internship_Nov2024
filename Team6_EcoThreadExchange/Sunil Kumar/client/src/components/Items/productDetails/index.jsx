import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const ProductDetails = () => {
  const { id } = useParams(); // Getting product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        if (!data) {
          throw new Error('Product not found');
        }
        setProduct(data); // Set the fetched product data
      } catch (error) {
        setError(error.message);
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => navigate('/items')} className={styles.backButton}>
          Return to Items
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleTrade = () => {
    console.log('Trade initiated for product:', product._id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{product.title}</h1>
        <button onClick={() => navigate('/items')} className={styles.backButton}>
          Go Back
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {product.image && (
            <img src={product.image} alt={product.title} className={styles.productImage} />
          )}
        </div>

        <div className={styles.details}>
          <h2>Item Details</h2>
          {/* Render product details dynamically */}
          <div className={styles.detailSection}>
            <h3>Size</h3>
            <p>{product.size}</p>
          </div>
          <div className={styles.detailSection}>
            <h3>Condition</h3>
            <p>{product.condition}</p>
          </div>

          <div className={styles.detailSection}>
            <h3>Preferences</h3>
            <div className={styles.preferences}>
              {product.preferences?.map((pref, index) => (
                <span key={index} className={styles.preference}>
                  {pref}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.postedBy}>
            Posted by <span className={styles.username}>{product.username}</span> on{' '}
            {new Date(product.postedDate).toLocaleDateString()}
          </div>

          <button onClick={handleTrade} className={styles.tradeButton}>
            Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
