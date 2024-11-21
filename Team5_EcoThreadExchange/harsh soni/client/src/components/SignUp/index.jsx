import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./signup.css"; // Import plain CSS

const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user", // Default role
    });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/users";
            const { data: res } = await axios.post(url, data);
            setMsg(res.message);
            setError(""); // Clear error on success
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                setMsg(""); // Clear message on error
            }
        }
    };

    // Handle role selection
    const handleRoleSelect = (role) => {
        setData({ ...data, role });
    };

    return (
        <div className="signup_container">
            <div className="signup_form_container">
                <div className="right">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <h1>Sign up</h1>
                        <h4>Create Account</h4>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className="input"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className="input"
                        />
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
                        <div className="role_selection">
                            <span
                                className={data.role === "admin" ? "active" : ""}
                                onClick={() => handleRoleSelect("admin")}
                            >
                                Admin
                            </span>
                            |
                            <span
                                className={data.role === "user" ? "active" : ""}
                                onClick={() => handleRoleSelect("user")}
                            >
                                User
                            </span>
                        </div>
                        {error && <div className="error_msg">{error}</div>}
                        {msg && <div className="success_msg">{msg}</div>}
                        <button type="submit" className="green_btn">
                            SIGN UP
                        </button>
                    </form>
                    <div className="welcome_text">
                        <p>Back to Login</p>
                        <Link to="/login" className="signin_link">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
