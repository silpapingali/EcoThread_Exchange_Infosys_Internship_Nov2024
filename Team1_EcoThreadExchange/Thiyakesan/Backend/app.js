process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Models
const User = require('./db/user');
const TradeItem = require('./db/tradeItem');
const MyItem = require('./db/myitems');

// Routes
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trade');
const myTradesRoutes = require('./routes/alltrades');
const myItemsRoutes = require('./routes/allitems');

// Middleware
const { verifyToken, isAdmin } = require('./middleware/auth-middleware');

const app = express();
const port = 3000;

// Ensure uploads/ directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads/ directory');
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PNG and JPG images are allowed.'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
    fileFilter
});

// Middleware setup
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadsDir));

// Test routes
app.get('/', (req, res) => {
    res.send('Server Running');
});

app.get('/test-get', (req, res) => {
    console.log('GET /test-get route hit');
    res.send('GET route is working');
});

// Route setup
app.use('/auth', authRoutes);
app.use('/trade', tradeRoutes);
app.use('/mytrades', verifyToken, myTradesRoutes);
app.use('/myitems', verifyToken, myItemsRoutes);

// Reset password API
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    console.log('Request body:', req.body);

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'An error occurred while updating the password.', error: error.message });
    }
});

// API to create a new trade item
app.post('/trade-items', upload.array('images', 5), async (req, res) => {
    try {
        console.log('POST /trade-items route was called');
        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Please upload at least one image.' });
        }

        const totalSize = req.files.reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 50 * 1024 * 1024) {
            return res.status(400).json({ error: 'Total image size should not exceed 50MB.' });
        }

        const { title, size, condition, preferences, offeredBy, username } = req.body;
        const userId = uuidv4();
        const preferencesArray = JSON.parse(preferences || '[]');
        const offeredByArray = JSON.parse(offeredBy || '[]');
        const imageFilenames = req.files.map(file => file.filename);

        const tradeItem = new TradeItem({
            title,
            size,
            condition,
            preferences: preferencesArray,
            offeredBy: offeredByArray,
            username,
            image: imageFilenames,
            createdOn: new Date(),
            userId,
        });

        const savedItem = await tradeItem.save();
        res.json({ message: 'Trade item added successfully!', item: savedItem });
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ error: 'Failed to add trade item.' });
    }
});

// API to fetch all trade items
app.get('/tradeitems/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const tradeItems = await TradeItem.find({ userId });
        res.status(200).json({ data: tradeItems });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trade items', error });
    }
});

// API to fetch my items
app.get('/myitems', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const myItems = await TradeItem.find({ owner: userId });

        if (!myItems.length) {
            return res.status(404).json({ message: 'No items found for this user' });
        }

        res.status(200).json(myItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// Paginated trade items API
app.get('/trade-items', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 4;
        const skip = (page - 1) * pageSize;

        const tradeItems = await TradeItem.find().skip(skip).limit(pageSize);
        const totalItems = await TradeItem.countDocuments();

        res.status(200).json({ data: tradeItems, totalCount: totalItems });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trade items', error });
    }
});

// Connect to MongoDB
async function connectDb() {
    try {
        await mongoose.connect('mongodb://localhost:27017', { dbName: 'infosys' });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
    }
}
connectDb();

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
