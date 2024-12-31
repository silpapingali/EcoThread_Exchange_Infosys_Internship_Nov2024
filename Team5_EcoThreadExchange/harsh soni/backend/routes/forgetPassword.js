const router = require("express").Router();
const { User } = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token");

router.post("/", async (req, res) => {
    try {
        const { email } = req.body;

 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User with given email not found" });
        }

 
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }


        const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password Reset", url);

        res.status(200).send({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
