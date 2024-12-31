import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import ProductCard from './ProductCard';
import styles from './styles.module.css';

const UserMain = () => {
  const navigate = useNavigate();

  const recommendedItems = [
    {
      title: 'Levis Jeans: 2 Years Old',
      date: '22 Jan 2024',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
      preferences: ['Jeans', 'Jackets', 'Boots']
    },
    {
      title: 'Lilac Purse from Canada',
      date: '22 Jan 2024',
      image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80',
      preferences: ['Jeans', 'Jackets', 'Bags']
    }
  ];

  const tradeItems = [
    {
      title: 'Rechargeable Batteries 1 Year Old',
      date: '15 Jan 2024',
      image: 'https://images.unsplash.com/photo-1619641805634-b867f535071f?auto=format&fit=crop&q=80',
      preferences: ['Electronics', 'Art']
    },
    {
      title: 'Denim Jacket Lee Cooper XL',
      date: '15 Jan 2024',
      image: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&q=80',
      preferences: ['Jackets', 'Casual', 'Bags']
    }
  ];

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recommended Items</h2>
            <button onClick={() => navigate('/items')} className={styles.button}>
              Go to My Items
            </button>
          </div>
          <div className={styles.grid}>
            {recommendedItems.map((item, index) => (
              <ProductCard key={index} {...item} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>My Trades (2)</h2>
            <button onClick={() => navigate('/trades')} className={styles.button}>
              Go to My Trades
            </button>
          </div>
          <div className={styles.grid}>
            {tradeItems.map((item, index) => (
              <ProductCard key={index} {...item} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserMain;