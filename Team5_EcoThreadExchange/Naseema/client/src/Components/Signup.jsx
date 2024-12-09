import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic input validation
        if (!username || !email || !password) {
            setError("All fields are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3000/auth/signup', { username, email, password });
    
            if (response.data.status) {
                navigate("/login");
            } else {
                setError(response.data.message || "Signup failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error during signup");
        }
    };
    

    return (
        <div className='container'>
            <form className='form' onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    placeholder='******'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'>Sign Up</button>
                <p>Have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
    
};

export default Signup;
