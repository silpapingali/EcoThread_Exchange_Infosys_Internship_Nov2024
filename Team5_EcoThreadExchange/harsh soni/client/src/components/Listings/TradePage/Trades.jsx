import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Trades.css";

const Trades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/items/${id}`);
        console.log('Fetched item:', response.data);
        setItem(response.data);
      } catch (error) {
        setError("Error fetching item details.");
        console.error("Error fetching item:", error);
      }
    };

    const fetchUserItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded._id;

        const response = await axios.get("http://localhost:8080/api/items");
        const userItems = response.data.filter(
          (item) => item.userId === userId && !item.traded && item._id !== id
        );
        console.log('Fetched user items:', userItems);
        setUserItems(userItems);
      } catch (error) {
        setError("Error fetching user items.");
        console.error("Error fetching user items:", error);
      }
    };

    fetchItem();
    fetchUserItems();
  }, [id]);

  const handleSelectItem = (item) => {
    console.log('Selected item:', item);
    setSelectedItem(item);
  };

  const handlePropose = async () => {
    if (!selectedItem) {
      alert("Please select an item to propose.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded._id;

      console.log('Sending proposal with items:', {
        proposedItem: selectedItem,
        selectedItem: item
      });

      const response = await axios.post(`http://localhost:8080/api/propose`, {
        proposedItemId: selectedItem._id,
        selectedItemId: item._id,
        proposedBy: userId,
        proposedTo: item.userId,
      });

      // Store items in localStorage before navigation
      const tradeData = {
        proposedItem: {
          _id: selectedItem._id,
          title: selectedItem.title,
          description: selectedItem.description,
          size: selectedItem.size,
          preferences: selectedItem.preferences,
          image: selectedItem.image,
          userId: selectedItem.userId
        },
        selectedItem: {
          _id: item._id,
          title: item.title,
          description: item.description,
          size: item.size,
          preferences: item.preferences,
          image: item.image,
          userId: item.userId
        },
        proposedBy: userId,
        proposedTo: item.userId,
        status: 'pending'
      };

      localStorage.setItem('tradeItems', JSON.stringify(tradeData));

      // Navigate with state
      navigate('/after-trades', {
        state: tradeData,
        replace: false
      });

      alert("Proposal sent successfully!");

    } catch (error) {
      console.error("Error sending proposal:", error);
      alert("Failed to send proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % userItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + userItems.length) % userItems.length
    );
  };

  if (!item) {
    return (
      <div className="trades-container">
        <Navbar />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="trades-container">
      <Navbar />
      {error && <div className="error-message">{error}</div>}
      <button className="go-back" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div className="trade-items">
        <div className="trade-item">
          <img
            src={`http://localhost:8080/${item.image}`}
            alt={item.title}
            className="trade-item-image"
          />
          <div className="trade-item-details">
            <h3>{item.title}</h3>
            <p>Size: {item.size}</p>
            <p>Description: {item.description}</p>
            <p>Preferences: {item.preferences}</p>
          </div>
        </div>

        <div className="arrow-container">
          <span className="arrow1">↔</span>
        </div>

        <div className="trade-item">
          {userItems.length > 0 ? (
            <div>
              <input
                type="checkbox"
                onChange={() => handleSelectItem(userItems[currentIndex])}
                checked={selectedItem?._id === userItems[currentIndex]?._id}
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
          ) : (
            <div className="no-items-message">
              <p>No items available for trade</p>
            </div>
          )}
        </div>
      </div>

      <div className="arrow-container">
        <span className="arrow" onClick={handlePrev}>
          ←
        </span>
        <span className="arrow" onClick={handleNext}>
          →
        </span>
      </div>

      <button
        className={`propose-button ${loading ? "loading" : ""}`}
        onClick={handlePropose}
        disabled={!selectedItem || loading}
      >
        {loading ? "Waiting..." : "Propose"}
      </button>
    </div>
  );
};

export default Trades;