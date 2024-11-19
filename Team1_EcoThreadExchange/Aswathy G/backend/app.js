const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const authRoutes = require("./routes/auth");
const { verifyToken, isAdmin } = require("./middleware/auth-middleware");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.use("/auth", authRoutes);

// MongoDB connection (with no SSL for local)
async function connectDb() {
    try {
        await mongoose.connect("mongodb://localhost:27017/infosys");
        console.log("MongoDb connected");
    } catch (err) {
        console.error("MongoDb connection error:", err);
    }
}

connectDb();

app.listen(port, () => {
    console.log("Server running on port", port);
});
