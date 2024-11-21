
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Grid, Card, InputAdornment } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(${process.env.=http:/localhost:8080}/login, { email, password });
            if (response.data.success) {
                navigate('/dashboard');
            } else {
                setError(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            setError("Login failed. Please try again.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Card sx={{
                padding: 4, borderRadius: 4, boxShadow: 6,
                background: 'linear-gradient(to right, #f8f8f8, #e7e9eb)'
            }}>
                <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Login to Threads & Thrift
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
                    >
                        Login
                    </Button>
                    <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                        <Button onClick={() => navigate('/forgot-password')} variant="text" color="secondary">
                            Forgot Password?
                        </Button>
                        <Button onClick={() => navigate('/register')} variant="text" color="secondary">
                            Register
                        </Button>
                    </Grid>
                </Box>
            </Card>
        </Container>
    );
};

export default Login;