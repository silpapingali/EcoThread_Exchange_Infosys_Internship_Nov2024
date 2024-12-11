// server/models/product.js
const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  preferences: { type: [String], required: true },
  imageData: { type: Buffer, required: true },  // Storing image data directly
  imageMimeType: { type: String, required: true },  // Storing MIME type
  postedDate: { type: Date, default: Date.now }, // Keeping this for backward compatibility
});

module.exports = mongoose.model('ProductDetails', productDetailsSchema);
