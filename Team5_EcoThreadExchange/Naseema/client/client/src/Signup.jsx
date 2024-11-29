import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Regular expression for strong password
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    // Validate required fields
    if (!name || !email || !password) {
      return setError("All fields are required");
    }

    // Validate strong password
    if (!strongPasswordRegex.test(password)) {
      return setPasswordError(
        "Password must be at least 8 characters, include an uppercase letter, lowercase letter, number, and special character."
      );
    }

    try {
      await axios.post("http://localhost:3001/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name"><strong>Name</strong></label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              onChange={(e) => {
                setPassword(e.target.value);
                if (!strongPasswordRegex.test(e.target.value)) {
                  setPasswordError(
                    "Password must be at least 8 characters, include an uppercase letter, lowercase letter, number, and special character."
                  );
                } else {
                  setPasswordError(""); // Clear error if password is strong
                }
              }}
            />
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        <p>Already have an account?</p>
        <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
