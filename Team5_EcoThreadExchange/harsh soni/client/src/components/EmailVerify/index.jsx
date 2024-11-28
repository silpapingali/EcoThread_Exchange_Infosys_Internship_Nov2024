import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./emailverify.css";
import success from "../images/tick.png"; 

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(null); 
    const param = useParams(); 

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
          
                const url = `http://localhost:8080/api/auth/users/${param.id}/verify/${param.token}`;
                const { data } = await axios.get(url);
                console.log(data);
                setValidUrl(true); 
            } catch (error) {
                console.log(error);
                setValidUrl(false); 
            }
        };
        verifyEmailUrl(); 
    }, [param]); 

    return (
        <Fragment>
            {validUrl === null ? (
           
                <h1>Verifying...</h1>
            ) : validUrl ? (
                
                <div className="container">
                    <img src={success} alt="Success" className="success_img" />
                    <h1>Email Verified Successfully!</h1>
                    <Link to="/login">
                        <button className="green_btn">Login</button>
                    </Link>
                </div>
            ) : (
                
                <div className="container">
                    <h1>404 - Page Not Found</h1>
                    <p>The verification link is either invalid or expired.</p>
                </div>
            )}
        </Fragment>
    );
};

export default EmailVerify;
