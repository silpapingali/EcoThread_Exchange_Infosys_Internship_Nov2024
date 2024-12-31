import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../Listings/Navbar/Navbar'; 
import IndexListings from "../Listings/DashboardPage/IndexListings"; 
import './UserHomePage.css'; 

const UserHomePage = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div>
      <Navbar /> 
      

      <IndexListings listings={items} /> 
    </div>
  );
};

export default UserHomePage;