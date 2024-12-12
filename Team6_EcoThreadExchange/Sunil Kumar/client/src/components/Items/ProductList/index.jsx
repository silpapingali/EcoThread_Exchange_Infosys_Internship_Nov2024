import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection
import styles from './styles.module.css';

const ProductList = ({ searchQuery, tradesFilter, dateFilter, refresh }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook to navigate to another page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        const data = await response.json();
        console.log('Fetched Products:', data); // Log fetched data
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [refresh]); // Re-fetch products when refresh state changes

  const handleProductClick = (productId) => {
    // Redirecting to the ProductDetails page with product ID
    navigate(`/products/${productId}`);
  };

  // Filter products based on search query
  const filteredBySearch = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products based on dateFilter
  const filteredProducts = filteredBySearch.filter((product) => {
    if (dateFilter) {
      const productDate = new Date(product.postedDate).toLocaleDateString();
      const selectedDate = new Date(dateFilter).toLocaleDateString();
      return productDate >= selectedDate; // Compare if posted date is after or equal to selected date
    }
    return true; // If no date filter is selected, show all products
  });

  return (
    <div className={styles.productList}>
      {filteredProducts.length === 0 ? (
        <p>No products found matching your criteria.</p>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className={styles.productCard}
            onClick={() => handleProductClick(product._id)} // Pass product ID to the redirect function
          >
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
                Posted by <span className={styles.username}>{product.username}</span> on{' '}
                {new Date(product.postedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
