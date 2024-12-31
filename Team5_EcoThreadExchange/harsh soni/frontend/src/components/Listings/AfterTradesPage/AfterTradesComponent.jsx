import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './AfterTradesComponent.css';

const AfterTradesComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tradeId } = useParams(); // Retrieve tradeId from URL
    const [proposedItem, setProposedItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Initially set to loading
    const [tradeStatus, setTradeStatus] = useState('pending');
    const [proposedBy, setProposedBy] = useState(null);
    const [proposedTo, setProposedTo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setCurrentUserId(decoded._id);
                console.log('Current User ID:', decoded._id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchTradeData = async () => {
            setLoading(true); // Start loading here
            try {
                // Fetch trade details using the tradeId
                const response = await axios.get(`http://localhost:8080/api/proposals/trade/${tradeId}`);
                const {
                    proposedItemId: fetchedProposedItem,
                    selectedItemId: fetchedSelectedItem,
                    status,
                    proposedBy: fetchedProposedBy,
                    proposedTo: fetchedProposedTo,
                } = response.data;
                setProposedItem(fetchedProposedItem || null);
                setSelectedItem(fetchedSelectedItem || null);
                setTradeStatus(status || 'pending');
                setProposedBy(fetchedProposedBy || null);
                setProposedTo(fetchedProposedTo || null);
                console.log('Proposed To (from fetch):', fetchedProposedTo);
            } catch (error) {
                console.error('Error fetching trade data:', error);
                alert('Failed to load trade data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const loadFromStorage = () => {
            setLoading(true); // Start loading here as well.
            const storedData = localStorage.getItem('tradeItems');
            if (location.state) {
                console.log('Using location state:', location.state);
                setProposedItem(location.state.proposedItem || null);
                setSelectedItem(location.state.selectedItem || null);
                setTradeStatus(location.state.status || 'pending');
                setProposedBy(location.state.proposedBy || null);
                setProposedTo(location.state.proposedTo || null);
                console.log('Proposed To:', location.state.proposedTo);
            } else if (storedData) {
                console.log('Using stored data:', JSON.parse(storedData));
                const { proposedItem: stored1, selectedItem: stored2, status, proposedBy, proposedTo } = JSON.parse(
                    storedData
                );
                setProposedItem(stored1 || null);
                setSelectedItem(stored2 || null);
                setTradeStatus(status || 'pending');
                setProposedBy(proposedBy || null);
                setProposedTo(proposedTo || null);
                console.log('Proposed To (from storage):', proposedTo);
            } else {
                console.log('No trade data found');

            }
             setLoading(false);  //always end in setting loading to false
        };

        if (tradeId) {
            fetchTradeData();
        } else {
           loadFromStorage();
        }
    }, [location.state, tradeId]);

    const handleAccept = async () => {
        if (!proposedItem || !selectedItem) {
            alert('Trade items are not properly loaded.');
            return renderStatusMessage();
        }

        setLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/proposals/accept`, {
                proposedItemId: proposedItem._id,
                selectedItemId: selectedItem._id,
                proposedBy,
                proposedTo,
            });
            setTradeStatus('accepted');
            localStorage.setItem(
                'tradeItems',
                JSON.stringify({
                    proposedItem,
                    selectedItem,
                    status: 'accepted',
                    proposedBy,
                    proposedTo,
                })
            );
            alert('Trade accepted successfully!');
        } catch (error) {
            console.error('Error accepting trade:', error);
            alert('Failed to accept trade. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!proposedItem || !selectedItem) {
            alert('Trade items are not properly loaded.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`http://localhost:8080/api/proposals/reject`, {
                proposedItemId: proposedItem._id,
                selectedItemId: selectedItem._id,
                proposedBy,
                proposedTo,
            });
            setTradeStatus('rejected');
            localStorage.setItem(
                'tradeItems',
                JSON.stringify({
                    proposedItem,
                    selectedItem,
                    status: 'rejected',
                    proposedBy,
                    proposedTo,
                })
            );
            alert('Trade rejected');
        } catch (error) {
            console.error('Error rejecting trade:', error);
            alert('Failed to reject trade. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStatusMessage = () => {
        if (tradeStatus === 'pending') {
            return <p>Waiting for response from item owner...</p>;
        } else if (tradeStatus === 'accepted') {
            return <p className="status-accepted">You have accepted this trade!</p>;
        } else if (tradeStatus === 'rejected') {
            return <p className="status-rejected">You have rejected this trade</p>;
        }
    };

    console.log('Type of currentUserId:', typeof currentUserId);
    console.log('Type of proposedTo:', typeof proposedTo);

    if (loading) {
        return (
            <div className="after-trades-container">
                {' '}
                <p>Loading trade data...</p>
            </div>
        );
    }

    return (
        <div className="after-trades-container">
            <Navbar />
             {console.log('Current User ID:', currentUserId)}
                {console.log('Proposed To:', proposedTo)}
                {console.log('Trade Status:', tradeStatus)}
            <div className="trade-status-container">
                <h2>Trade Proposal Status</h2>

                <div className="items-container">
                    {proposedItem && selectedItem ? (
                        <>
                            <div className="proposed-item">
                                <h3>Proposed Item</h3>
                                <div className="trade-item">
                                    <img
                                        src={`http://localhost:8080/${proposedItem.image}`}
                                        alt={proposedItem.title}
                                        className="trade-item-image"
                                        onError={(e) => {
                                            console.error('Image load error:', e);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <div className="trade-item-details">
                                        <h3>{proposedItem.title}</h3>
                                        <p>Size: {proposedItem.size}</p>
                                        <p>Description: {proposedItem.description}</p>
                                        <p>Preferences: {proposedItem.preferences}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="trade-arrow">↔</div>

                            <div className="selected-item">
                                <h3>Selected Item</h3>
                                <div className="trade-item">
                                    <img
                                        src={`http://localhost:8080/${selectedItem.image}`}
                                        alt={selectedItem.title}
                                        className="trade-item-image"
                                        onError={(e) => {
                                            console.error('Image load error:', e);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <div className="trade-item-details">
                                        <h3>{selectedItem.title}</h3>
                                        <p>Size: {selectedItem.size}</p>
                                        <p>Description: {selectedItem.description}</p>
                                        <p>Preferences: {selectedItem.preferences}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Unable to load trade items. Please try again.</p>
                    )}
                </div>

                <div className="status-message">
                    {renderStatusMessage()}
                </div>
            </div>

           {tradeStatus === 'pending' && (
                 <div className="action-buttons-container">
                    <h3>Actions</h3>
                    <button
                        className="accept-button"
                        onClick={handleAccept}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Accept Trade'}
                    </button>
                    <button
                        className="reject-button"
                        onClick={handleReject}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Reject Trade'}
                    </button>
                </div>
            )}


                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                    style={{ marginTop: '1rem' }}
                >
                    Back to Dashboard
                </button>
        </div>
    );
};

export default AfterTradesComponent;