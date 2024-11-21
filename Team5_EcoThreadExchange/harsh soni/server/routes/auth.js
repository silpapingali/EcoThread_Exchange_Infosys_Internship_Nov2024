const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });

        // Save user to the database
        await newUser.save();

        // Create a verification token and send email if the user is successfully created
        let token = await Token.findOne({ userId: newUser._id });
        if (!token) {
            token = await new Token({
                userId: newUser._id,
                token: crypto.randomBytes(32).toString("hex"),  // Generate a random token
            }).save();
            
            // Construct the verification URL
            const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
            
            // Send the verification email
            await sendEmail(newUser.email, "Verify Email", url);
        }

        res.status(201).send({ message: "User created successfully. Please verify your email." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
