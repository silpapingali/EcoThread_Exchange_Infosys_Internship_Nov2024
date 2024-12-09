const router = require("express").Router();
const Token = require("../models/token");
const User = require("../models/user");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

// Debugging User import
console.log("User Model Debug:", User);

// Send password reset link
router.post("/", async (req, res) => {
  try {
    // Validate email
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if user exists
    console.log("Looking for user with email:", req.body.email);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.warn("User not found for email:", req.body.email);
      return res.status(404).send({ message: "User with given email does not exist!" });
    }

    // Check if a token already exists for the user
    console.log("Checking token existence...");
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      console.log("Creating new token...");
      token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await token.save();
      console.log("Token saved successfully");
    }

    // Generate password reset URL
    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
    console.log("Generated password reset URL:", url);

    // Send email with the password reset link
    try {
      console.log("Sending email...");
      await sendEmail(user.email, "Password Reset", `Click here to reset your password: ${url}`);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).send({ message: "Failed to send email. Please try again later." });
    }

    res.status(200).send({ message: "Password reset link sent to your email account." });
    } catch (error) {
      console.error("Unhandled error in password reset:", {
        message: error.message,
        stack: error.stack,
      });
      return res.status(500).send({ message: "Internalllllllllll server error" });
    }
});

// Verify URL
router.get("/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    // Remove token after verification
    await token.remove();
    console.log("Token removed after verification");

    res.status(200).send({ message: "Valid URL. Token has been invalidated." });
  } catch (error) {
    console.error("Error verifying URL:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

// Reset password
router.post("/:id/:token", async (req, res) => {
  try {
    // Validate password
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Verify user and token
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid or expired token" });

    // Hash new password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashPassword;

    // Save user and ensure token is already removed
    await user.save();
    console.log("Password reset successfully for user:", user.email);

    res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
