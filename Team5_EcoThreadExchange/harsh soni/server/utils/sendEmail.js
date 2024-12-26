const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT), 
            secure: process.env.SECURE === "true", 
            auth: {
                user: "scam8079@gmail.com",
                pass: "lgdo uftq ycnw tlii" , 
            },
        });

        const mailOptions = {
            from: `"EcoThread" <${process.env.USER}>`, 
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
