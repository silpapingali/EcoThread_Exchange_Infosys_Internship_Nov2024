const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT), // Ensure EMAIL_PORT is 587 for TLS
            secure: process.env.SECURE === "true", // Convert 'true'/'false' string to boolean
            auth: {
                user: "scam8079@gmail.com",
                pass: "lgdo uftq ycnw tlii" , // Replace with App Password if using 2FA
            },
        });

        const mailOptions = {
            from: `"EcoThread" <${process.env.USER}>`, // Optional, adds a name before the email
            to: email,
            subject: subject,
            text: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Email not sent. Error:", error);
    }
};
