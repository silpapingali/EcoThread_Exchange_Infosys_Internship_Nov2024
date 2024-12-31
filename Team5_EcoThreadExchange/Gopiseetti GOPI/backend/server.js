import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./config/cloudinary.js";
// import path from 'path';
// import { fileURLToPath } from 'url';

// Derive the directory name from the URL
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
connectDB();
connectCloudinary();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
