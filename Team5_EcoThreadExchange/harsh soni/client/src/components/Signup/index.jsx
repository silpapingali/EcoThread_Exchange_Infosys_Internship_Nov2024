import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './signup.module.css'

const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		role: "user", 
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

	// Handle role selection via links
	const handleRoleSelect = (role) => {
		setData({ ...data, role });
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Sign up</h1>
						<h4>Create Account</h4>
						{/* Input for First Name */}
						<input
							type="text"
							placeholder="First Name"
							name="firstName"
							onChange={handleChange}
							value={data.firstName}
							required
							className={styles.input}
						/>
						{/* Input for Last Name */}
						<input
							type="text"
							placeholder="Last Name"
							name="lastName"
							onChange={handleChange}
							value={data.lastName}
							required
							className={styles.input}
						/>
						{/* Input for Email */}
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						{/* Input for Password */}
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{/* Role Selection Links */}
						<div className={styles.role_selection}>
							<span
								className={data.role === "admin" ? styles.active : ""}
								onClick={() => handleRoleSelect("admin")}
							>
								Admin
							</span>
							|
							<span
								className={data.role === "user" ? styles.active : ""}
								onClick={() => handleRoleSelect("user")}
							>
								User
							</span>
						</div>
						{/* Error Message */}
						{error && <div className={styles.error_msg}>{error}</div>}
						{/* Success Message */}
						{msg && <div className={styles.success_msg}>{msg}</div>}
						{/* Submit Button */}
						<button type="submit" className={styles.green_btn}>
							SIGN UP
						</button>
					</form>
					<div className={styles.welcome_text}>
						<p>Back to Login </p>
						<Link to="/login" className={styles.signin_link}>
							Sign In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
