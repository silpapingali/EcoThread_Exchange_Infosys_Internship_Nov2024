
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Card, InputAdornment } from '@mui/material';
import { Lock } from '@mui/icons-material';

const ResetPassword = () => {
    const { token } = useParams(); // Token from the reset link
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password) => /^(?=.[A-Z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must contain at least 8 characters, one uppercase letter, one number, and one special character.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.API_URL || "http://localhost:5173"}/reset-password`,
            
                 { token, 
                    password });
            if (response.data.success) {
                setMessage("Password reset successful. Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || "Unable to reset password.");
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
                <Box component="form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Reset Password
                    </Typography>
                    {message && <Typography color="primary" align="center">{message}</Typography>}
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        required
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
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        required
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
                        sx={{
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.05)' },
                        }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default ResetPassword;