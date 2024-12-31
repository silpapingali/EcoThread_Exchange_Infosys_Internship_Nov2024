import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Navbar/Navbar";
import './PublicListings.css'; 
import { Link } from 'react-router-dom'; 

const PublicListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000); 
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/items'); 
            setListings(response.data); 
            setFilteredListings(response.data); 

            const token = localStorage.getItem("token");
            if (token) {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUserId(decoded._id); 
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    fetchItems();
  }, []);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchValue) ||
      listing.description.toLowerCase().includes(searchValue)
    );
    setFilteredListings(filtered); 
  };

  const handlePriceFilter = () => {
    const filtered = listings.filter((listing) => {
      const price = listing.price; 
      return price >= minPrice && price <= maxPrice;
    });
    setFilteredListings(filtered);
  };

  const visibleListings = filteredListings.filter(listing => listing.userId !== userId && !listing.traded); // Exclude traded items

  return (
    <div className="public-listings3">
      <Navbar onSearch={handleSearch} /> 
      <div className="search-section3">
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
      <div className="content-container3">
        <div className="filter-container3">
          <h2>Filters</h2>
          <div className="filter3">
            <label>Trades greater than</label>
            <input
              type="range"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onMouseUp={handlePriceFilter}
            />
            <span>{minPrice}</span>
          </div>
          <div className="filter3">
            <label>Posted After</label>
            <input type="date" />
          </div>
        </div>
        <div className="listings-container3">
          {visibleListings.length === 0 ? (
            <div className="no-results-message3">
              <h3>No items found</h3>
              <p>Sorry, we couldn't find any items matching your search criteria.</p>
            </div>
          ) : (
            visibleListings.map((listing) => (
              <div className="listing-card3" key={listing._id}>
                <img 
                  src={`http://localhost:8080/${listing.image}`} 
                  alt={listing.title} 
                  className="listing-image3" 
                />
                <div className="listing-details3">
                  <h4>{listing.title}</h4>
                  <p>Size: {listing.size}</p>
                  <p>Price: &#8377; {listing.price.toLocaleString("en-IN")}</p>
                  <p>Preferences: {listing.preferences}</p>
                  <p className="listing-posted3">
                    Posted by: {listing.postedBy} on {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                  <div className="button-container3">
                    <Link to={`/listings/${listing._id}`} className="view-button3">View</Link>
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

export default PublicListings;