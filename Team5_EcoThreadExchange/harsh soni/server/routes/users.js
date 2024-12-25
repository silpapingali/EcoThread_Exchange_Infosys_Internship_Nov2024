const express = require('express');
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();

    console.log("Attempting to create token for user:", user._id);
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    console.log("Token created:", token);

    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({ userId: req.params.id, token: req.params.token });
    if (!token) return res.status(400).send("Invalid token.");
    
    // Remove the token after verification
    await token.deleteOne(); // Updated
    

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Block a user
router.put("/:id/block", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ message: "User blocked successfully", user });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Unblock a user
router.put("/:id/unblock", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { blocked: false }, { new: true });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ message: "User unblocked successfully", user });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;