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
                const response = await axios.get('http://localhost:8080/api/items?role=admin');
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
            setItems(items.map(item =>
                item._id === id ? { ...item, deleted: true } : item
            ));
        } catch (error) {
            console.error("Error marking item as deleted:", error);
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

    const userMap = Object.fromEntries(users.map(user => [user._id, user]));

    return (
        <div className="admin-dashboard">
            <NavbarAdmin />
            <h1>Admin Dashboard</h1>
            <div className="item-list">
                {items.map(item => {
                    const user = userMap[item.userId];

                    return (
                        <div className={`item-card ${item.deleted ? 'Suspended'  : ''}`} key={item._id}>
                            <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="item-image" />
                            <div className="item-details">
                                <h3>{item.title} {item.deleted && '(Deleted)'}</h3>
                                <p>Size: {item.size}</p>
                                <p>Description: {item.description}</p>
                                <p>Price: &#8377; {item.price.toLocaleString("en-IN")}</p>
                                <p>Preferences: {item.preferences}</p>
                                <div className="item-actions">
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        {item.deleted ? 'Item is Suspend' : 'Block Item'}
                                    </button>
                                    {user ? (
                                        <div className="user-actions">
                                            {user.blocked ? (
                                                <p className="suspend-info"><button>User is blocked</button></p>
                                            ) : (
                                                <button
                                                    className="suspend-button"
                                                    onClick={() => handleSuspendAccount(user._id)}
                                                >
                                                    Suspend Account
                                                </button>
                                            )}
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
            <footer className="dashboard-footer">
                Threads&Thrift. All rights reserved. 2024
            </footer>
        </div>
    );
};

export default AdminDashboard;
