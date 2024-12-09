import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./login.css"; // Regular CSS import

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [email, setEmail] = useState(""); // For forgot password form
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // Success message for forgot password
    const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle between login and forgot password forms

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleForgotChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);

            // Store token and role in local storage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            // Redirect based on role
            if (res.data.role === "admin") {
                window.location = "/admin-home";
            } else {
                window.location = "/user-home";
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/forgotpassword"; // Forgot password API endpoint
            const { data } = await axios.post(url, { email });
            setMessage(data.message); // Show success message
            setError("");
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                setMessage(""); // Clear success message on error
            }
        }
    };

    return (
        <div className="login_container">
            <div className="login_form_container">
                <div className="left">
                    {/* Toggle between Login and Forgot Password forms */}
                    {!isForgotPassword ? (
                        <form className="form_container" onSubmit={handleSubmit}>
                            <h1>Login</h1>
                            <h4>Login to Your Account</h4>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                required
                                className="input"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                required
                                className="input"
                            />
                            {error && <div className="error_msg">{error}</div>}
                            <button type="submit" className="green_btn">
                                LOGIN
                            </button>
                            <div className="additional_links">
                                <p
                                    className="forgot_link"
                                    onClick={() => {
                                        setIsForgotPassword(true); // Switch to Forgot Password form
                                        setError("");
                                        setMessage("");
                                    }}
                                >
                                    Forgot Password?
                                </p>
                            </div>
                            <div className="signup_text">
                                <p>New Here?</p>
                                <Link to="/signup" className="signup_link">
                                    SIGN UP
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form className="form_container" onSubmit={handleForgotSubmit}>
                            <h1>Forgot Password</h1>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                onChange={handleForgotChange}
                                value={email}
                                required
                                className="input"
                            />
                            {message && <div className="success_msg">{message}</div>}
                            {error && <div className="error_msg">{error}</div>}
                            <button type="submit" className="green_btn">
                                Submit
                            </button>
                            <div className="additional_links">
                                <p
                                    className="back_to_login"
                                    onClick={() => {
                                        setIsForgotPassword(false); // Switch back to Login form
                                        setError("");
                                        setMessage("");
                                    }}
                                >
                                    Back to Login
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
