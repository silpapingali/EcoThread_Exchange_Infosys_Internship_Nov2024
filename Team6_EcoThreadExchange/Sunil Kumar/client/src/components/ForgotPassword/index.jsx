import axios from 'axios';
import styles from './style.module.css';
import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:8080/api/password-reset`;
            const {data} = await axios.post(url,{email});
            setMsg(data.message);
            setError("");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
                setMsg("");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className={styles.input}
                />
                {error && <div className={styles.error_msg}>{error}</div>}
                {msg && <div className={styles.success_msg}>{msg}</div>}
                <button type="submit" className={styles.green_btn}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
