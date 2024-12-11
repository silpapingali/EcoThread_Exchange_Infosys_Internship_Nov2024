import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <h1>Threads&Thrift</h1>
      <nav>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/items')}>Items</li>
          <li onClick={() => navigate('/trades')}>Trade</li>
          <li onClick={() => navigate('/new-item')} className={styles.newItem}>New Item</li>
          <li onClick={() => navigate('/logout')}>Logout</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;