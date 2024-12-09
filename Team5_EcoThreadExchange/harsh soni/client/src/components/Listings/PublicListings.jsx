import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; 
import './PublicListings.css'; 
import { Link } from 'react-router-dom'; 
const PublicListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/items');
        setListings(response.data);
        setFilteredListings(response.data); 
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

  const handlePriceFilter = () => {
    const filtered = listings.filter((listing) => {
      const price = listing.price; 
      return price >= minPrice && price <= maxPrice;
    });
    setFilteredListings(filtered);
  };

  return (
    <div className="public-listings">
      <Navbar onSearch={handleSearch} /> 
      <div className="search-section">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="content-container">
        <div className="filter-container">
          <h2>Filters</h2>
          <div className="filter">
            <label>Exact Match</label>
            <input type="checkbox" />
          </div>
          <div className="filter">
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
          <div className="filter">
            <label>Posted After</label>
            <input type="date" />
          </div>
        </div>
        <div className="listings-container">
          {filteredListings.map((listing) => (
            <div className="listing-card" key={listing._id}>
              <img 
                src={`http://localhost:8080/${listing.image}`} 
                alt={listing.title} 
                className="listing-image" 
              />
              <div className="listing-details">
                <h4>{listing.title}</h4>
                <p>Size: {listing.size}</p>
                <p>Price: &#8377; {listing.price.toLocaleString("en-IN")}</p>
                <p>Location: {listing.location}, {listing.country}</p>
                <p>Preferences: {listing.preferences}</p>
                <p className="listing-posted">
                  Posted by: {listing.postedBy} on {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                <Link to={`/listings/${listing._id}`}>View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicListings;