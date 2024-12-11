import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../userMain/Header';
import Footer from '../userMain/Footer';
import styles from './styles.module.css';

const Layout = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;