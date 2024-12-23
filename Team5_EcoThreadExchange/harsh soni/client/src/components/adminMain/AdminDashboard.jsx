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
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users');
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
        try {
            await axios.put(`http://localhost:8080/api/users/${userId}/block`);
            setUsers(users.map(user => user._id === userId ? { ...user, blocked: true } : user));
        } catch (error) {
            console.error("Error suspending account:", error);
        }
    };

    const handleViewItem = (itemId) => {
        navigate(`/admin/view-item/${itemId}`);
    };

    return (
        <div className="admin-dashboard">
            <NavbarAdmin />
            <h1>Admin Dashboard</h1>
            <div className="item-list">
                {items.map(item => (
                    <div className="item-card" key={item._id}>
                        <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="item-image" />
                        <div className="item-details">
                            <h3>{item.title}</h3>
                            <p>Price: &#8377; {item.price.toLocaleString("en-IN")}</p>
                            <div className="item-actions">
                                <button className="admin-button" onClick={() => handleDelete(item._id)}>BlockItem</button>
                                <button className="admin-button" onClick={() => handleSuspendAccount(item.userId)}>Suspend Account</button>
                               
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h2>User Management</h2>
            <div className="user-list">
                {users.map(user => (
                    <div className="user-card" key={user._id}>
                        <p>Email: {user.email}</p>
                        <div className="user-actions">
                            {user.blocked ? (
                                <p>User is blocked</p>
                            ) : (
                                <button className="admin-button" onClick={() => handleSuspendAccount(user._id)}>Suspend Account</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard; 