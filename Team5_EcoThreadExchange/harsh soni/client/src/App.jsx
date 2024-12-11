import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Login from "./components/Login"; 
import Signup from "./components/SignUp"; 
import AdminHomePage from "./components/adminMain"; 
import UserHomePage from "./components/userMain"; 
import EmailVerify from "./components/EmailVerify";
import EditItem from "./components/Listings/EditItem"; 
import CreateItem from "./components/Listings/CreateItem"; 
import PublicListings from "./components/Listings/PublicListings"; 
import ViewItem from "./components/Listings/ViewItem";
import Trades from './components/Listings/Navigation/Trades'; 
import Logout from './components/Listings/Navigation/Logout'; 



const App = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/users/:id/verify/:token" element={<EmailVerify />} />

                {token && role === "admin" ? (
                    <Route path="/" element={<AdminHomePage />} />
                ) : token && role === "user" ? (
                    <Route path="/" element={<UserHomePage />} />
                ) : (
                    <Route path="/" element={<Navigate replace to="/login" />} />
                )}

                {/* Listings Routes */}
                <Route path="/listings" element={<PublicListings />} />
                <Route path="/listings/new" element={<CreateItem />} />
                <Route path="/listings/:id/edit" element={<EditItem />} />
                <Route path="/listings/:id" element={<ViewItem />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/create-item" element={<CreateItem />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;