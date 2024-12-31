// server/models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  preferences: { type: Array, required: true },
  imageData: { type: Buffer, required: true },
  imageMimeType: { type: String, required: true },
  username: { type: String, required: true }, // Added username field
  postedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProductDetails", productSchema);
