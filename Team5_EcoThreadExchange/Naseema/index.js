import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js';

 // Load environment variables

const app = express();

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // React app's URL
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use(express.json());
app.use(cookieParser());

// Use user routes
app.use('/auth', UserRouter);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/authentication')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
