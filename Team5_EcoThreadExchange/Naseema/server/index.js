import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js';
import path from "path";
import itemRoutes from "./routes/item.js"; // Import item routes
import { fileURLToPath } from "url"; // Required to get `__dirname` in ES6
 // Load environment variables

const app = express();

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // React app's URL
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());
app.use("/api/items", itemRoutes);
// Use user routes
app.use('/auth', UserRouter);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/authentication')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

