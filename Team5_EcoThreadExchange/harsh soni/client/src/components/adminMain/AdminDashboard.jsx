import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/items');
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/items/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleView = (id) => {
        navigate(`/listings/${id}`);
    };

    const handleTrade = (id) => {
        // Implement trade logic here
        alert(`Trade initiated for item ID: ${id}`);
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="item-list">
                {items.map(item => (
                    <div className="item-card" key={item._id}>
                        <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="item-image" />
                        <div className="item-details">
                            <h3>{item.title}</h3>
                            <p>Price: &#8377; {item.price.toLocaleString("en-IN")}</p>
                            <div className="item-actions">
                                {/* <button onClick={() => handleView(item._id)}>View</button>
                                <button onClick={() => handleTrade(item._id)}>Allow Trade</button> */}
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard; 