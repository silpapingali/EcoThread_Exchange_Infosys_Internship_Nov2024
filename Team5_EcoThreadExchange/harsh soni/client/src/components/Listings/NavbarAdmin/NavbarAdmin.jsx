import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarAdmin.css'; 

const NavbarAdmin = () => {
  return (
    <nav className="navbar-admin">
      <div className="navbar-brand">Admin Dashboard</div>
      <ul className="navbar-links">
        <li><Link to="/admin/items">Items</Link></li>
        <li><Link to="/admin/user">User</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default NavbarAdmin; 