import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Navbar/Navbar"; // Corrected path to Navbar component
import './Trades.css';

const Trades = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [allItems, setAllItems] = useState([]); // State to hold all items
  const [userItems, setUserItems] = useState([]); // State to hold user's items
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current image index
  const [isPending, setIsPending] = useState(false); // State to track proposal status
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

    const fetchAllItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/items'); // Fetch all items
        setAllItems(response.data);
      } catch (error) {
        setError("Error fetching all items.");
        console.error("Error fetching all items:", error);
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
    fetchAllItems();
    fetchUserItems();
  }, [id]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % userItems.length); // Loop to the start
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + userItems.length) % userItems.length); // Loop to the end
  };

  const handlePropose = async () => {
    setIsPending((prev) => !prev); // Toggle pending state

    if (!isPending) {
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
        } catch (error) {
            console.error("Error sending proposal:", error);
            alert("Failed to send proposal. Please try again.");
        }
    }
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
            <>
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
              <div className="trade-arrows">
                <span className="arrow" onClick={handlePrev}>&#8592;</span> {/* Left arrow */}
                <span className="arrow" onClick={handleNext}>&#8594;</span> {/* Right arrow */}
              </div>
            </>
          )}
        </div>
      </div>
      
      {isPending && <div className="pending-message">Pending...</div>}
      
      <button 
        className={`propose-button ${isPending ? 'cancel-button' : ''}`} 
        onClick={handlePropose}
      >
        {isPending ? "Cancel Trade" : "Propose"}
      </button>
    </div>
  );
};

export default Trades;