import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Navbar/Navbar"; // Correct path to Navbar component

import './MyItem.css'; 
import { Link } from 'react-router-dom'; 

const MyItem = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/api/items', {
          headers: {
            'x-auth-token': token, // Include token for authentication
          },
        });
        const userId = JSON.parse(atob(token.split('.')[1]))._id; // Decode token to get user ID
        const userItems = response.data.filter(item => item.userId === userId); // Filter items by user ID
        setListings(userItems);
        setFilteredListings(userItems); 
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  const handleSearch = () => {
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(filtered); 
  };

  return (
    <div className="public-listings1">
      <Navbar onSearch={handleSearch} /> 
      <h1 className="myitem-heading">My Item</h1>
      <div className="button-container">
        <Link to="/listings/new" className="create-item-button">Create New Item</Link>
      </div>
      <div className="search-section1">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="content-container1">
        <div className="listings-container1">
          {filteredListings.map((listing) => (
            <div className="myitem-listing-card1" key={listing._id}>
              <img 
                src={`http://localhost:8080/${listing.image}`} 
                alt={listing.title} 
                className="listing-image1" 
              />
              <div className="listing-details1">
                <h4>{listing.title}</h4>
                <p>Size: {listing.size}</p>
                <p>Price: &#8377; {listing.price.toLocaleString("en-IN")}</p>
                <p>Preferences: {listing.preferences}</p>
                <p className="listing-posted1">
                  Posted by: {listing.postedBy} on {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                <div className="button-container">
                  <Link to={`/listings/${listing._id}/edit`} className="edit-button">Edit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyItem;