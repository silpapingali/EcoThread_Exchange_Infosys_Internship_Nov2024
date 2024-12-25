import { v2 as cloudinary } from "cloudinary";
import { config as configDotenv } from "dotenv";

configDotenv();

// Function to configure and connect to Cloudinary
const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export default connectCloudinary;
