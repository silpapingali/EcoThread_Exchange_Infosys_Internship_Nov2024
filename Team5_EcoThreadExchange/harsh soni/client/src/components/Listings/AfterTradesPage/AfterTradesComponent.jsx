import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './AfterTradesComponent.css';
import axios from 'axios';

const AfterTradesComponent = () => {
    const location = useLocation();
    const proposedItem = location.state?.proposedItem;
    const selectedItem = location.state?.selectedItem;

    const [isAccepted, setIsAccepted] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:8080/api/proposals/accept`, {
                proposalId: proposedItem._id,
                acceptedBy: JSON.parse(atob(token.split('.')[1]))._id
            });
            setIsAccepted(true);
            setPopupMessage("Proposal accepted!");
        } catch (error) {
            console.error("Error accepting proposal:", error);
            setPopupMessage("Failed to accept proposal. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:8080/api/proposals/reject`, {
                proposalId: proposedItem._id,
                rejectedBy: JSON.parse(atob(token.split('.')[1]))._id
            });
            setIsRejected(true);
            setPopupMessage("Proposal rejected!");
        } catch (error) {
            console.error("Error rejecting proposal:", error);
            setPopupMessage("Failed to reject proposal. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const closePopup = () => {
        setPopupMessage('');
    };

    return (
        <div className="after-trades-container">
            <Navbar />
            <h1>Trade Proposals</h1>
            
            <div className="trade-details-container">
                <div className="proposed-item-container">
                    <h2>Proposed Item Details:</h2>
                    {proposedItem ? (
                        <div className="proposed-item">
                           
                           <h3>{proposedItem.title}</h3>
                            <p>Description: {proposedItem.description}</p>
                            <p>Size: {proposedItem.size}</p>
                            <p>Preferences: {proposedItem.preferences}</p>
                            {/* <p>User ID: {proposedItem.userId}</p> */}
                            <img src={`http://localhost:8080/${proposedItem.image}`} alt={proposedItem.title} />
                        </div>
                    ) : (
                        <p>No proposed item available.</p>
                    )}
                </div>

                {/* Pending Status */}
                <div className="pending-status">
                    <p>Pending.........</p>
                </div>

                <div className="selected-item-container">
                    <h2>Your Selected Item:</h2>
                    {selectedItem ? (
                        <div className="user-item">
                            <h3>{selectedItem.title}</h3>
                            <p>Size: {selectedItem.size}</p>
                            <p>Description: {selectedItem.description}</p>
                            <p>Preferences: {selectedItem.preferences}</p>
                            <img src={`http://localhost:8080/${selectedItem.image}`} alt={selectedItem.title} />
                        </div>
                    ) : (
                        <p>No selected item available.</p>
                    )}
                </div>
            </div>

            {popupMessage && (
                <div className="popup-message">
                    <p>{popupMessage}</p>
                    <button onClick={closePopup}>Close</button>
                </div>
            )}
        </div>
    );
};

export default AfterTradesComponent;
