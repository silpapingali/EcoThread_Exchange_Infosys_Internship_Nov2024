import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './IndexListings.css'; 

const IndexListings = ({ listings }) => {
  const [proposedItem, setProposedItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('tradeItems');
    if (storedData) {
      const { proposedItem: stored1, selectedItem: stored2 } = JSON.parse(storedData);
      setProposedItem(stored1 || null);
      setSelectedItem(stored2 || null);
    }
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  };  

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
        <Link to="/after-trades" className="my-items-button2">Go to my Trades</Link>
      </div>
      <div className="my-trades-section">
        {proposedItem && (
          <div className="trade-details">
            <h4>Proposed Item: {proposedItem.title}</h4>
            <img 
              src={`http://localhost:8080/${proposedItem.image}`} 
              alt={proposedItem.title} 
              className="listing-image2" 
            />
           <p>Selected Item: {selectedItem.title}</p>
            <p>Size: {proposedItem.size}</p>
            <p>Preferences: {proposedItem.preferences}</p>
          </div>
        )}
        {selectedItem && (
          <div className="trade-details">
            <h4>Selected Item: {selectedItem.title}</h4>
            <img 
              src={`http://localhost:8080/${selectedItem.image}`} 
              alt={selectedItem.title} 
              className="listing-image2" 
            />
             <p>Proposed Item: {proposedItem.title}</p>
            <p>Size: {selectedItem.size}</p>
            <p>Preferences: {selectedItem.preferences}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexListings;