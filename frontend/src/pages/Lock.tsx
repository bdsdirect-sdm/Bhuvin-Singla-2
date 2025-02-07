import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { QRCode } from "qrcode.react"; // Correct named import
import "../css/Lock.css"; // Import the external CSS

const Lock = () => {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
        setErrorMessage("");
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (password === "12345") {
            navigate("/register");
        } else {
            setErrorMessage("Invalid password! Please try again.");
        }
    };

    return (
        <div className="lock-page">
            <div className="lock-container">
                {/* QR Code */}
                <div className="qr-code">
                    {/* <QRCode value="This is a QR code" size={180} /> */}
                </div>
                <h1 className="header-text">Secure Access</h1>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter password"
                        className="formik-input"
                    />
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button type="submit" className="lock-button">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Lock;
