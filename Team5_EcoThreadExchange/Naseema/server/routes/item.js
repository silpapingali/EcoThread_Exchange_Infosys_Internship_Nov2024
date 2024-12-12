import express from "express";
import multer from "multer";
import path from "path";
import Item from "../models/Item.js"; // Import the Item model

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to store files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});

// POST route to create a new item
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const { title, size, condition, preferences } = req.body;
        const imagePath = req.file.path; // Path of the uploaded image

        // Save item to the database
        const newItem = new Item({
            title,
            size,
            condition,
            preferences,
            image: imagePath,
        });

        await newItem.save();
        res.status(201).json({ message: "Item created successfully!", item: newItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router using ES6 syntax
export default router;
