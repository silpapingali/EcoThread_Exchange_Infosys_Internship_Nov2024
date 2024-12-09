import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!email) {
            setErrorMessage("Please enter your email.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
    
            if (response.data.status) {
                setSuccessMessage("Check your email for the reset password link.");
                setTimeout(() => navigate("/login"), 2000); // Redirect after showing the message
            } 
            else {
                setErrorMessage(response.data.message || "Failed to send reset link.");
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    

    return (
        <div className='container'>
            <form className='form' onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
