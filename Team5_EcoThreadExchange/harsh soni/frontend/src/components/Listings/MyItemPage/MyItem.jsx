import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Navbar/Navbar"; 
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
            'x-auth-token': token, 
          },
        });
        const userId = JSON.parse(atob(token.split('.')[1]))._id; 
        const userItems = response.data.filter(item => item.userId === userId && !item.traded); // Exclude traded items
        setListings(userItems);
        setFilteredListings(userItems); 
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchValue) ||
      listing.description.toLowerCase().includes(searchValue)
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)} 
        />
        <button onClick={() => handleSearch(searchTerm)}>Search</button>
      </div>
      <div className="content-container1">
        <div className="listings-container1">
          {filteredListings.length === 0 ? (
            <div className="no-results-message1">
              <h3>No items found</h3>
              <p>Sorry, we couldn't find any items matching your search criteria.</p>
            </div>
          ) : (
            filteredListings.map((listing) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyItem;