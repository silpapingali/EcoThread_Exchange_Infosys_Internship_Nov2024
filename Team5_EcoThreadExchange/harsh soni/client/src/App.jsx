import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login"; // Login Component
import Signup from "./components/SignUp"; // Signup Component
import AdminHomePage from "./components/adminMain"; // Admin Homepage Component
import UserHomePage from "./components/userMain"; // User Homepage Component
import EmailVerify from "./components/EmailVerify";

const App = () => {
    // Retrieve token and role from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
                

                {/* Role-Based Redirection */}
                {token && role === "admin" ? (
                    <Route path="/" element={<AdminHomePage />} />
                ) : token && role === "user" ? (
                    <Route path="/" element={<UserHomePage />} />
                ) : (
                    <Route path="/" element={<Navigate replace to="/login" />} />
                )}

                {/* Fallback for unmatched routes */}
                    <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
