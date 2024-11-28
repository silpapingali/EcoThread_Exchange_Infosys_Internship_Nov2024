const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


router.post("/", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;


    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }

    try {
      
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({ message: "Email already in use" });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

   
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });

 
        await newUser.save();


        let token = await Token.findOne({ userId: newUser._id });
        if (!token) {
            token = await new Token({
                userId: newUser._id,
                token: crypto.randomBytes(32).toString("hex"), 
            }).save();
            
            
            const url = `${process.env.BASE_URL}api/auth/users/${newUser._id}/verify/${token.token}`;
            
           
            await sendEmail(newUser.email, "Verify Email", url);
        }

        res.status(201).send({ message: "User created successfully. Please verify your email." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get("/users/:id/verify/:token", async (req, res) => {
    try {
        const { id, token } = req.params;

   
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).send({ message: "Invalid link" });
        }

     
        const foundToken = await Token.findOne({ userId: user._id, token: token });
        if (!foundToken) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

       
        user.verified = true;
        await user.save();

       
        await Token.deleteOne({ userId: user._id });

     
        res.status(200).send({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
