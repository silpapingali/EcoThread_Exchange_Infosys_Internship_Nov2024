import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from "../../Listings/NavbarAdmin/NavbarAdmin";
import './UserDetailAdminPage.css';

const UserDetailAdminPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleBlockUser = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${userId}/block`);
            setUsers(users.map(user => user._id === userId ? { ...user, blocked: true } : user));
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${userId}/unblock`);
            setUsers(users.map(user => user._id === userId ? { ...user, blocked: false } : user));
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    return (
        <div className="user-detail-admin-page">
            <NavbarAdmin />
            <h1>User Details</h1>
            <div className="user-list">
                {users.map(user => (
                    <div className="user-card" key={user._id}>
                        <h3>Email: {user.email}</h3>
                        <p>User ID: {user._id}</p>
                        <p>First Name: {user.firstName}</p>
                        <p>Last Name: {user.lastName}</p>  
                        <p>Verified: {user.verified ? "Yes" : "No"}</p>
                        <p>Role: {user.role}</p>
                        <p>Blocked: {user.blocked ? "Yes" : "No"}</p>
                        <div className="user-actions">
                            {user.blocked ? (
                                <button onClick={() => handleUnblockUser(user._id)}>Unblock User</button>
                            ) : (
                                <button onClick={() => handleBlockUser(user._id)}>Block User</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDetailAdminPage; 