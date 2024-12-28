const fs = require('fs');
const path = require('path');


const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const router = require("express").Router();
const Item = require("../models/item");
const multer = require("multer");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });


router.post("/", auth, upload.single('image'), async (req, res) => {
  try {
    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      preferences: req.body.preferences,
      size: req.body.size,
      image: req.file.path.replace(/\\/g, '/'), 
      userId: req.user._id,
    });
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ deleted: false });
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send({ message: "Item not found" });
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:id", upload.single('image'), async (req, res) => {
  const { title, description, price, preferences, size } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, {
      title,
      description,
      price,
      preferences,
      size,
    }, { new: true });

    if (!updatedItem) return res.status(404).send('Item not found');
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send({ message: "Item not found" });
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get('/edit/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get("/random", async (req, res) => {
  try {
    const count = await Item.countDocuments({ deleted: false });
    if (count === 0) {
      return res.status(404).send({ message: "No items available" });
    }
    const random = Math.floor(Math.random() * count);
    const randomItem = await Item.findOne({ deleted: false }).skip(random);
    res.status(200).send(randomItem);
  } catch (error) {
    console.error("Error fetching random item:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});

// Get all items (with optional search query)
router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const items = await Item.find({
            deleted: false,
            title: { $regex: searchQuery, $options: 'i' } // Case-insensitive search
        });
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;