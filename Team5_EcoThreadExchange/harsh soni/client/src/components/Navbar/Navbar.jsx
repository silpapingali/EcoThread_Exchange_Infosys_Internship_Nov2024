import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Threads&Thrift</div>
      <ul className="navbar-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/listings">Items</Link></li>
        <li><Link to="/trades">Trades</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;