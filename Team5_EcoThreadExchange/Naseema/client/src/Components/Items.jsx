import React from 'react';
import Navbar from './NavBar';
import '../Cards1.css';

const Items = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header">
          <h2>New Item</h2>
          <button className="go-back-button">Go Back</button>
        </div>
        <div className="item-details">
          <div className="item-image">
            <img
              src="https://tse1.mm.bing.net/th?id=OIP.rgJQvzlvFIKp-E8vQ0wZ-AHaHa&pid=Api&P=0&h=180"
              alt="Levis Jeans"
            />
          </div>
          <div className="item-info">
            <h3>Item Details</h3>
            <form>
              <label>Title:</label>
              <input
                type="text"
                defaultValue="Levis Jeans, 2 Years Old, Good Condition"
              />
              <label>Size:</label>
              <input type="text" defaultValue="36 Waist" />
              <label>Condition:</label>
              <input
                type="text"
                defaultValue="Levis Jeans, 2 Years Old, Good Condition"
              />
              <label>Preferences:</label>
              <input
                type="text"
                defaultValue="Shoes, Jackets, Dolls"
              />
              <button type="submit" className="post-button">
                Post
              </button>
            </form>
          </div>
        </div>
        <footer>
          <p>Threads&Thrift. All rights reserved. 2024</p>
        </footer>
      </div>
    </>
  );
};

export default Items;
