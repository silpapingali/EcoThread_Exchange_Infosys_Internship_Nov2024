require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const forgetPasswordRoute = require('./routes/forgetPassword');
const itemRoutes = require("./routes/items");
const proposeRoutes = require('./routes/propose');
const proposalRoutes = require('./routes/proposals');
const path = require("path");

const app = express();

// Connect to the database
connection();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/forgotpassword", forgetPasswordRoute);
app.use("/api/items", itemRoutes);
app.use('/api/propose', proposeRoutes);
app.use('/api/proposals', proposalRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
