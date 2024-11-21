
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Card, InputAdornment } from '@mui/material';
import { AccountCircle, Email, Lock } from '@mui/icons-material';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password) => /^(?=.[A-Z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must have 8 characters, uppercase, number, and special character.");
            return;
        }

        try {
            const response = await axios.post(${process.env.=http:/localhost:8080}/register, { name, email, password });
            if (response.data.success) {
                alert("Registration successful! Check your email for confirmation.");
                navigate('/login');
            } else {
                setError(response.data.message || "Registration failed.");
            }
        } catch (error) {
            setError("Service unavailable. Try again later.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Card sx={{
                padding: 4, borderRadius: 4, boxShadow: 6,
                background: 'linear-gradient(to right, #f8f8f8, #e7e9eb)'
            }}>
                <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Register for Threads & Thrift
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        label="Name"
                        required
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        required
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        required
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        required
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
                    >
                        Register
                    </Button>
                    <Button onClick={() => navigate('/login')} variant="text" color="secondary" fullWidth>
                        Already have an account? Login
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default Register;