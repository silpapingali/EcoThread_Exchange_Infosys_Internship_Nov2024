import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.Navbar}>
      <span className={styles.navLogo}>Threads & Thrift</span>
      <div className={`${styles.navItems} ${isOpen ? styles.open : ''}`}>
        <button onClick={() => navigate('/dashboard')} className={styles.navButton}>
          Dashboard
        </button>
        <button onClick={() => navigate('/items')} className={styles.navButton}>
          Items
        </button>
        <button onClick={() => navigate('/trades')} className={styles.navButton}>
          Trade
        </button>
        <button onClick={() => navigate('/logout')} className={styles.navButton}>
          Logout
        </button>
      </div>
      <div
        className={`${styles.navToggle} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.bar}></div>
      </div>
    </div>
  );
};

export default Header;
