import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Navbar/Navbar"; 
import './Trades.css';

const Trades = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [userItems, setUserItems] = useState([]); 
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/items/${id}`);
        setItem(response.data);
      } catch (error) {
        setError("Error fetching item.");
        console.error("Error fetching item:", error);
      }
    };

    const fetchUserItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded._id; // Get the current user's ID

        const response = await axios.get('http://localhost:8080/api/items'); // Fetch all items
        const userItems = response.data.filter(item => item.userId === userId); // Filter user's items
        setUserItems(userItems); // Set user's items
      } catch (error) {
        setError("Error fetching user items.");
        console.error("Error fetching user items:", error);
      }
    };

    fetchItem();
    fetchUserItems();
  }, [id]);

  const handleSelectItem = (item) => {
    setSelectedItem(item); // Set the selected item
  };

  const handlePropose = async () => {
    if (selectedItem) {
      try {
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded._id; // Get the current user's ID

        const response = await axios.post(`http://localhost:8080/api/propose`, {
          itemId: item._id, // ID of the item being proposed
          proposedBy: userId, // ID of the user making the proposal
          proposedTo: item.userId, // ID of the user who owns the item
        });
        console.log("Proposal sent:", response.data);
        alert("Proposal sent successfully!");

        // Navigate to AfterTradesComponent with the proposed item details and selected item
        navigate('/after-trades', { state: { proposedItem: item, selectedItem: selectedItem } });
      } catch (error) {
        console.error("Error sending proposal:", error);
        alert("Failed to send proposal. Please try again.");
      }
    } else {
      alert("Please select an item to propose.");
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % userItems.length); // Loop to the start
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + userItems.length) % userItems.length); // Loop to the end
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="trades-container">
      <Navbar />
      {error && <div>{error}</div>}
      <button className="go-back" onClick={() => navigate(-1)}>Go Back</button>
      <div className="trade-items">
        <div className="trade-item">
          {item ? (
            <>
              <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="trade-item-image" />
              <div className="trade-item-details">
                <h3>{item.title}</h3>
                <p>Size: {item.size}</p>
                <p>Description: {item.description}</p>
                <p>Preferences: {item.preferences}</p>
              </div>
            </>
          ) : (
            <p>Loading item...</p>
          )}
        </div>
        <div className="arrow-container">
          <span className="arrow1">&#8596;</span>
        </div>

        <div className="trade-item">
          {userItems.length > 0 && (
            <div>
              <input
                type="checkbox"
                onChange={() => handleSelectItem(userItems[currentIndex])} // Select the current item
                checked={selectedItem?._id === userItems[currentIndex]?._id} // Check if this item is selected
              />
              <img
                src={`http://localhost:8080/${userItems[currentIndex].image}`}
                alt={userItems[currentIndex].title}
                className="trade-item-image"
              />
              <div className="trade-item-details">
                <h3>{userItems[currentIndex].title}</h3>
                <p>Size: {userItems[currentIndex].size}</p>
                <p>Description: {userItems[currentIndex].description}</p>
                <p>Preferences: {userItems[currentIndex].preferences}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="arrow-container">
        <span className="arrow" onClick={handlePrev}>&#8592;</span> {/* Left arrow */}
        <span className="arrow" onClick={handleNext}>&#8594;</span> {/* Right arrow */}
      </div>

      <button 
        className={`propose-button`} 
        onClick={handlePropose}
      >
        Propose
      </button>
    </div>
  );
};

export default Trades;