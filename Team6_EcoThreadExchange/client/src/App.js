import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import AdminHomePage from "./components/adminMain/index"; // Corrected import path
import UserHomePage from "./components/userMain/index"; // Corrected import path

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>
      {/* Role-based redirection */}
      {token && role === "admin" ? (
        <Route path="/" element={<AdminHomePage />} />
      ) : token && role === "user" ? (
        <Route path="/" element={<UserHomePage />} />
      ) : (
        <Route path="/" element={<Navigate replace to="/login" />} />
      )}

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users/:id/verify/:token" element={<EmailVerify />} />

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
