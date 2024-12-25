import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../Listings/NavbarAdmin/NavbarAdmin';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/items');
                console.log("Fetched Items:", response.data);
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users');
                console.log("Fetched Users:", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchItems();
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/items/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleSuspendAccount = async (userId) => {
        const user = users.find(user => user._id === userId);
        if (user) {
            try {
                await axios.put(`http://localhost:8080/api/users/${user._id}/block`);
                setUsers(users.map(u => u._id === user._id ? { ...u, blocked: true } : u));
            } catch (error) {
                console.error("Error suspending account:", error);
            }
        } else {
            console.error("User not found with ID:", userId);
        }
    };

    // Create a mapping of user IDs for quick access
    const userMap = Object.fromEntries(users.map(user => [user._id, user]));

    return (
        <div className="admin-dashboard">
            <NavbarAdmin />
            <h1>Admin Dashboard</h1>
            <div className="item-list">
                {items.map(item => {
                    const user = userMap[item.userId]; // Use the mapping to find the user

                    return (
                        <div className="item-card" key={item._id}>
                            <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="item-image" />
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p>Price: &#8377; {item.price.toLocaleString("en-IN")}</p>
                                <div className="item-actions">
                                    <button className="admin-button" onClick={() => handleDelete(item._id)}>Delete</button>
                                    {user ? (
                                        <div className="user-card">
                                            <p>Email: {user.email}</p>
                                            <p>User ID: {user._id}</p>
                                            <div className="user-actions">
                                                {user.blocked ? (
                                                    <p>User is blocked</p>
                                                ) : (
                                                    <button className="admin-button" onClick={() => handleSuspendAccount(user._id)}>
                                                        Suspend Account
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>User not found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <h2>User Management</h2>
            <div className="user-list">
                {users.map(user => (
                    <div className="user-card" key={user._id}>
                        <p>Email: {user.email}</p>
                        <p>User ID: {user._id}</p>
                        <div className="user-actions">
                            {user.blocked ? (
                                <p>User is blocked</p>
                            ) : (
                                <button className="admin-button" onClick={() => handleSuspendAccount(user._id)}>
                                    Suspend Account
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard; 