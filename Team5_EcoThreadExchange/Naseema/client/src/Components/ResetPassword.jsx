import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            setErrorMessage("Please enter your new password.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3000/auth/reset-password/${token}`, { password });

            if (response.data.status) {
                setSuccessMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
            } else {
                setErrorMessage(response.data.message || "Failed to reset password.");
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className='container'>
            <form className='form' onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <label htmlFor='password'>New Password:</label>
                <input
                    type='password'
                    placeholder='******'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'>Reset</button>
            </form>
        </div>
    );
};

export default ResetPassword;
