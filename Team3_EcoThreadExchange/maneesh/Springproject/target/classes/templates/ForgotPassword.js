
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Card, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(${process.env.=http:/localhost:8080}/forgot-password, { email });
            if (response.data.success) {
                setMessage("If this email is registered, a password reset link has been sent.");
            } else {
                setError(response.data.message || "Unable to process request.");
            }
        } catch (error) {
            setError("Service is currently unavailable. Please try again later.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Card sx={{
                padding: 4,
                borderRadius: 4,
                boxShadow: 6,
                background: 'linear-gradient(to right, #f8f8f8, #e7e9eb)',
            }}>
                <Box component="form" onSubmit={handleForgotPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Forgot Password
                    </Typography>
                    {message && <Typography color="primary" align="center">{message}</Typography>}
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        label="Registered Email"
                        type="email"
                        fullWidth
                        required
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.05)' },
                        }}
                    >
                        Send Reset Link
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/login'}
                        color="secondary"
                        variant="text"
                        fullWidth
                    >
                        Back to Login
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default ForgotPassword;