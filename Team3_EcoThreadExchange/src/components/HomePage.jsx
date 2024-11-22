import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or tokens (if any)
    // For now, just navigate back to login page
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to Threads & Thrift
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Your destination for sustainable fashion. Enjoy shopping!
      </Typography>

      {/* Logout button */}
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default HomePage;
