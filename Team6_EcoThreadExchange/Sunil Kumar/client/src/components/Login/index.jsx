import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between forms

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
			const url = "http://localhost:8080/api/forgotpassword";
			const { data } = await axios.post(url, { email });
			setMessage(data.message);
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

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					{/* Toggle between Login and Forgot Password forms */}
					{!isForgotPassword ? (
						<form className={styles.form_container} onSubmit={handleSubmit}>
							<h1>Thread & Thrift</h1>
							<h4>Login to Your Account</h4>
							<input
								type="email"
								placeholder="Email"
								name="email"
								onChange={handleChange}
								value={data.email}
								required
								className={styles.input}
							/>
							<input
								type="password"
								placeholder="Password"
								name="password"
								onChange={handleChange}
								value={data.password}
								required
								className={styles.input}
							/>
							{error && <div className={styles.error_msg}>{error}</div>}
							<button type="submit" className={styles.green_btn}>
								Sign In
							</button>
							<div className={styles.additional_links}>
								<p
									className={styles.forgot_link}
									onClick={() => setIsForgotPassword(true)}
								>
									Forgot Password?
								</p>
							</div>
							<div className={styles.signup_text}>
								<p>New Here?</p>
								<Link to="/signup" className={styles.signup_link}>
									Sign Up
								</Link>
							</div>
						</form>
					) : (
						<form className={styles.form_container} onSubmit={handleForgotSubmit}>
							<h1>Forgot Password</h1>
							<input
								type="email"
								placeholder="Enter your email"
								name="email"
								onChange={handleForgotChange}
								value={email}
								required
								className={styles.input}
							/>
							{message && <div className={styles.success_msg}>{message}</div>}
							{error && <div className={styles.error_msg}>{error}</div>}
							<button type="submit" className={styles.green_btn}>
								Submit
							</button>
							<div className={styles.additional_links}>
								<p
									className={styles.back_to_login}
									onClick={() => {
										setIsForgotPassword(false);
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
