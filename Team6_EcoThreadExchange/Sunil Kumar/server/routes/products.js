// server/routes/products.js
const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const ProductDetails = require("../models/product");
const { User } = require("../models/user");

const router = express.Router();

const storage = multer.memoryStorage();

// Middleware to verify the token and get the user details
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const verified = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(verified._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// POST route for adding a new product
router.post(
  "/",
  verifyToken,
  multer({ storage }).single("image"),
  async (req, res) => {
    try {
      const { title, size, condition, preferences } = req.body;
      const imageData = req.file ? req.file.buffer : null;
      const imageMimeType = req.file ? req.file.mimetype : null;

      if (!title || !size || !condition || !preferences || !imageData || !imageMimeType) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const username = `${req.user.firstName} ${req.user.lastName}`;

      const newProductDetails = new ProductDetails({
        title,
        size,
        condition,
        preferences: JSON.parse(preferences),
        imageData,
        imageMimeType,
        username, // Store username
        postedDate: new Date(),
      });

      await newProductDetails.save();
      res.status(201).json({ message: "Product added successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// GET route for fetching all products
router.get("/", async (req, res) => {
  try {
    const products = await ProductDetails.find();
    res.status(200).json(
      products.map((product) => ({
        ...product._doc,
        image: product.imageData
          ? `data:${product.imageMimeType};base64,${product.imageData.toString("base64")}`
          : null,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

// GET route for fetching a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductDetails.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({
      ...product._doc,
      image: product.imageData
        ? `data:${product.imageMimeType};base64,${product.imageData.toString("base64")}`
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product details." });
  }
});

module.exports = router;
