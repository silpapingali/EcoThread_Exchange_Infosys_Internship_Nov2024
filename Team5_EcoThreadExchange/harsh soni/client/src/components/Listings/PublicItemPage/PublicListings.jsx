import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Navbar/Navbar"; // Correct path to Navbar component
import './PublicListings.css'; 
import { Link } from 'react-router-dom'; 

const PublicListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000); 
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null); // State to hold the current user's ID

  useEffect(() => {
    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/items'); // Fetch all items
            setListings(response.data); // Set all items for public view
            setFilteredListings(response.data); // Initialize filtered listings

            // Get the user ID from the token
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUserId(decoded._id); // Set the current user's ID
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    fetchItems();
  }, []);

  const handleSearch = () => {
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Filter out the user's own items from the listings
  const visibleListings = filteredListings.filter(listing => listing.userId !== userId);

  return (
    <div className="public-listings3">
      <Navbar onSearch={handleSearch} /> 
      <div className="search-section3">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
        />
        <button onClick={handleSearch}>Search</button>
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
          {visibleListings.map((listing) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicListings;