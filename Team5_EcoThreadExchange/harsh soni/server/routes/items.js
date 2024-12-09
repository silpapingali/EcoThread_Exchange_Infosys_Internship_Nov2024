const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const router = require("express").Router();
const Item = require("../models/item");
const multer = require("multer");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  }
});

const upload = multer({ storage: storage });

// Create a new item
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      country: req.body.country,
      location: req.body.location,
      preferences: req.body.preferences,
      size: req.body.size,
      image: req.file.path.replace(/\\/g, '/'), // Replace backslashes with forward slashes
    });
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send({ message: "Item not found" });
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update item by ID
router.put("/:id", upload.single('image'), async (req, res) => {
  const { title, description, price, country, location, preferences, size } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, {
      title,
      description,
      price,
      country,
      location,
      preferences,
      size,
    }, { new: true });

    if (!updatedItem) return res.status(404).send('Item not found');
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
});

// Delete item by ID
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send({ message: "Item not found" });
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to get an item by ID
router.get('/edit/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;