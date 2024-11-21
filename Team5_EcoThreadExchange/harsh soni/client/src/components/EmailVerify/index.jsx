import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./emailverify.css"; // Import plain CSS
import success from "../images/tick.png"; // Success image path

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(null); // null to distinguish loading state
    const param = useParams(); // Access route parameters (id and token)

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const url = `http://localhost:8080/api/users/${param.id}/verify/${param.token}`;
                const { data } = await axios.get(url);
                console.log(data);
                setValidUrl(true); // Set validUrl to true on success
            } catch (error) {
                console.log(error);
                setValidUrl(false); // Set validUrl to false on error
            }
        };
        verifyEmailUrl(); // Trigger verification when the component mounts
    }, [param]); // Dependency on route parameters (id and token)

    return (
        <Fragment>
            {validUrl === null ? (
                // Loading state (when URL is still being processed)
                <h1>Verifying...</h1>
            ) : validUrl ? (
                // Success case
                <div className="container">
                    <img src={success} alt="Success" className="success_img" />
                    <h1>Email Verified Successfully!</h1>
                    <Link to="/login">
                        <button className="green_btn">Login</button>
                    </Link>
                </div>
            ) : (
                // Error case
                <div className="container">
                    <h1>404 - Page Not Found</h1>
                    <p>The verification link is either invalid or expired.</p>
                </div>
            )}
        </Fragment>
    );
};

export default EmailVerify;
