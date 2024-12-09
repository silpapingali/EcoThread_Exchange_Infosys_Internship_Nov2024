import { useState, useEffect, Fragment } from 'react';
import success from '../../images/success.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./emailverify.css";

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { id, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Verifying email with ID:", id, "and token:", token);
        const verifyEmailUrl = async () => {
            try {
                const url = `http://localhost:8080/api/users/${id}/verify/${token}`;
                const { data } = await axios.get(url);
                console.log("Verification response:", data);
                setValidUrl(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                console.error("Verification error:", error);
                setValidUrl(false);
                setErrorMessage("The verification link is either expired or invalid.");
            }
        };
        verifyEmailUrl();
    }, [id, token, navigate]);

    return (
        <Fragment>
            {validUrl ? (
                <div className="container">
                    <img src={success} alt="success_img" className="success_img" />
                    <h1>Email verified successfully</h1>
                    <Link to="/login">
                        <button className="green_btn">Login</button>
                    </Link>
                </div>
            ) : (
                <div className="container">
                    <h1>{errorMessage || "404 Not Found"}</h1>
                </div>
            )}
        </Fragment>
    );
};

export default EmailVerify;
