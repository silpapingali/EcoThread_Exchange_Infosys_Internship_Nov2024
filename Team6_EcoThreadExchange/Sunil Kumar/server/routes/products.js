// server/routes/products.js
const express = require('express');
const multer = require('multer');
const ProductDetails = require('../models/product');

const router = express.Router();

const storage = multer.memoryStorage(); // Using memory storage

router.use('/uploads', express.static('uploads'));

// POST route for adding a new product
router.post('/', multer({ storage }).single('image'), async (req, res) => {
  try {
    const { title, size, condition, preferences } = req.body;
    const imageData = req.file ? req.file.buffer : null;
    const imageMimeType = req.file ? req.file.mimetype : null;

    if (!title || !size || !condition || !preferences || !imageData || !imageMimeType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newProductDetails = new ProductDetails({
      title,
      size,
      condition,
      preferences: JSON.parse(preferences),
      imageData,
      imageMimeType,
      postedDate: new Date(),
    });

    await newProductDetails.save();
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET route for fetching all products
router.get('/', async (req, res) => {
  try {
    const products = await ProductDetails.find();
    res.status(200).json(products.map(product => ({
      ...product._doc,
      image: product.imageData ? `data:${product.imageMimeType};base64,${product.imageData.toString('base64')}` : null,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

module.exports = router;
