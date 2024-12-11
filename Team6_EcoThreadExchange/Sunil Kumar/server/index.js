// Server/index.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const productRoutes = require("./routes/products"); // Updated with new ProductDetails model

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/products", productRoutes); // Register the updated products route with new collection

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
