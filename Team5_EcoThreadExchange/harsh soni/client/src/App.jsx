import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Login from "./components/Login"; 
import Signup from "./components/SignUp"; 
import UserHomePage from "./components/userMain"; 
import EmailVerify from "./components/EmailVerify";
import EditItem from "./components/Listings/EditItemPage/EditItem"; 
import CreateItem from "./components/Listings/CreateItemPage/CreateItem"; 
import PublicListings from "./components/Listings/PublicItemPage/PublicListings"; 
import ViewItem from "./components/Listings/ViewItemPage/ViewItem";
import Trades from './components/Listings/TradePage/Trades'; 
import Logout from './components/Listings/LogoutPage/Logout'; 
import AdminDashboard from './components/adminMain/AdminDashboard';
import MyItem from './components/Listings/MyItemPage/MyItem';
import UserDetailAdminPage from './components/adminMain/UserDetailAdminPage/UserDetailAdminPage';





const App = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <Router>
            {/* <Navbar /> */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/users/:id/verify/:token" element={<EmailVerify />} />

                {token && role === "admin" ? (
                    <Route path="/" element={<AdminDashboard/>} />
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
                <Route path="/trades/:id" element={<Trades />} />
                <Route path="/myitem" element={<MyItem />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/create-item" element={<CreateItem />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/user" element={<UserDetailAdminPage />} />
             

                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;