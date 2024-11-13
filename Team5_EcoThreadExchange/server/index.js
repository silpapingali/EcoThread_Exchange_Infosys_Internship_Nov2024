const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Define Employee schema and model
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/employee", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (user && user.password === password) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Incorrect email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    const employee = await EmployeeModel.create(req.body);
    res.status(201).json({ message: "Registration successful", employee });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
