import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching food items" });
  }
};

// Add a new food item
const addFood = async (req, res) => {
  try {
    const imageFile = req.file; // Get the uploaded file

    if (!imageFile || !imageFile.buffer) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Upload the image to Cloudinary using the buffer
    const imageUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(imageFile.buffer); // Use the buffer from Multer
    });

    // Create a new food item with the image URL from Cloudinary
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imageUpload.secure_url, // Store the image URL from Cloudinary
    });

    await food.save(); // Save the food item in the database
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Error adding food" });
  }
};

// Delete a food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    const publicId = food.image.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    // Delete the food item from the database
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

export { listFood, addFood, removeFood };
