const express = require('express');
const router = express.Router();
const MyItem = require('../db/myitems'); 
const { verifyToken } = require('../middleware/auth-middleware');
const mongoose = require('mongoose');
const Trade=require("./../db/alltrades");
const { getAllItems } = require('../handlers/all-items-hanlder'); // Import the controller function

router.get('/allitems', getAllItems);


router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await MyItem.find({ userId:userId})
        .populate('userId', 'name email')  
        .exec();
        if (items.length === 0) {
             return res.status(404).send({ message: "No trades found for this user." });
        }
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
});
  
  
module.exports = router;