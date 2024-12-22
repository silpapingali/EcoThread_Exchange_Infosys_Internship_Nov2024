import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials=true;

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            console.error("Validation Error: Both fields are required");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });

            if (response.data.status) {
                navigate("/home"); // Replace with the target page after login
            } else {
                console.error(response.data.message || "Login failed");
            }
        } catch (err) {
            console.error("Error during login:", err.response?.data || err.message);
        }
    };

    return (
        <div className='container'>
            <form className='form' onSubmit={handleLogin}>
                <h2>Login</h2>
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
                <button type='submit'>Login</button>
                <Link to="/forgotPassword">Forgot Password?</Link>
                <p>Don't have an account? <Link to="/signup">Signup</Link></p>
            </form>
        </div>
    );
};

export default Login;
