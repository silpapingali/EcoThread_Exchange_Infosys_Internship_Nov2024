// src/components/IndexListings.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 
import './IndexListings.css'; 


const IndexListings = ({ listings }) => {
  return (
    <div><h3>My Items</h3>
    <div className="index-listings">
      
      {listings.map((listing) => (
        <div className="listing-card" key={listing._id}>
          <img 
            src={`http://localhost:8080/${listing.image}`} 
            alt={listing.title} 
            className="listing-image" 
          />
          <div className="listing-details">
            <h4 className="listing-title">{listing.title}</h4>
            <p className="listing-size">Size: {listing.size}</p>
            <p className="listing-price">Price: &#8377; {listing.price.toLocaleString("en-IN")}</p>
            {/* <p className="listing-location">Location: {listing.location}, {listing.country}</p> */}
            <p className="listing-preferences">Preferences: {listing.preferences}</p>
            <Link to={`/listings/${listing._id}`}>View</Link><br></br>
            <Link to={`/listings/${listing._id}/edit`} className="edit-link">Edit</Link>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default IndexListings;