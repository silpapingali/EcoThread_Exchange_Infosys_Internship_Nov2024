import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import HomePage from './components/HomePage';
import './App.css'; // Global CSS for the app

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default Route: Redirect to Login */}
          <Route path="/" element={<Login />} />

          {/* Route for Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Route for Home Page (after login) */}
          <Route path="/home" element={<HomePage />} />

          {/* Route for Register Page */}
          <Route path="/register" element={<Register />} />

          {/* Route for Forgot Password */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Route for Reset Password */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Catch-All Route: Redirect to Login for Undefined Paths */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
