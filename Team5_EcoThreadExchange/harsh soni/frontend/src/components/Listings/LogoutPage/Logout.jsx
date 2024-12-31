import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Logout.css'; 
import Navbar from "../Navbar/Navbar";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        alert("You have been logged out.");
        
        
        navigate('/login'); 
    };

    return (
        <div className="logout-container">
            <Navbar />
            <h1>Logout Page</h1>
           
            <p>Are you sure you want to log out?</p>
            <button onClick={handleLogout}>Confirm Logout</button>
        </div>
    );
};

export default Logout;