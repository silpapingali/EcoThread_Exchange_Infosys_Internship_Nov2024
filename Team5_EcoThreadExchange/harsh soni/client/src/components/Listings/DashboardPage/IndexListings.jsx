// src/components/IndexListings.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 
import './IndexListings.css'; 

const IndexListings = ({ listings }) => {
  // Function to shuffle the listings array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };  

  // Shuffle listings and limit to 4 random items
  const randomListings = shuffleArray([...listings]).slice(0, 4);

  return (
    <div>
      <h2 className="recommended-heading2">Recommended Items</h2>
      <div className="button-container2">
        <Link to="/myitem" className="my-items-button2">Go to My Items</Link>
      </div>
      <div className="index-listings2">
        {randomListings.map((listing) => (
          <div className="listing-card2" key={listing._id}>
            <img 
              src={`http://localhost:8080/${listing.image}`} 
              alt={listing.title} 
              className="listing-image2" 
            />
            <div className="listing-details2">
              <h4 className="listing-title2">{listing.title}</h4>
              <p className="listing-price2">Price: &#8377; {listing.price.toLocaleString("en-IN")}</p>
              <p className="listing-size2">Size: {listing.size}</p>
              <p className="listing-preferences2">Preferences: {listing.preferences}</p>
              <Link to={`/listings/${listing._id}`} className="view-link2">View</Link>
              <br />
            </div>
          </div>
        ))}
      </div>
      <h2 className="recommended-heading2">My Trades</h2>
      <div className="button-container2">
        <Link to="/myitem" className="my-items-button2">Go to my Trades</Link>
      </div>
    </div>
  );
};

export default IndexListings;