import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './login.module.css'

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
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
	

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login</h1>
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
							LOGIN
						</button>
					</form>
					<div className={styles.signup_text}>
						<p>OR</p>
						<Link to="/signup" className={styles.signup_link}>
							SIGN UP
						</Link>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Login;
