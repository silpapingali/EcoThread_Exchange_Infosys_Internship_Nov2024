const express = require('express');
const router = express.Router();
const MyItem = require('../db/myitems'); 
const { verifyToken } = require('../middleware/auth-middleware');
const mongoose = require('mongoose');
const User=require("../db/user");
const Trade=require("./../db/alltrades");
const { getAllItems,buildFilterQuery } = require('../handlers/all-items-handler'); 


const trades=require("./../db/trades");
router.get('/recommended', verifyToken, async (req, res) => {
  try {
      const loggedInUserId = req.user.id; 
      const userItems = await MyItem.find({ userId: loggedInUserId });

      if (!userItems || userItems.length === 0) {
          return res.status(404).json({ message: 'No items found for the logged-in user.' });
      }
      const userPreferences = new Set();
      userItems.forEach((item) => {
          if (item.preferences && Array.isArray(item.preferences)) {
              item.preferences.forEach((preference) => userPreferences.add(preference));
          }
      });
      if (userPreferences.size === 0) {
          return res.status(404).json({ message: 'No preferences found for the logged-in user.' });
      }
      const recommendedItems = await MyItem.find({
          preferences: { $in: Array.from(userPreferences) }, 
          userId: { $ne: loggedInUserId }, 
      })
          .limit(4) 
          .exec();  
      res.status(200).json({ data: recommendedItems });
  } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({
          message: 'Failed to fetch recommendations',
          error: error.message,
      });
  }
});

router.get('/allitems',verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
        const { searchTerm, exactMatch, date, page = 1, pageSize = 4 } = req.query;
        const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
        //filterQuery.isBlocked = { $ne: true };
        filterQuery.userId={$ne:userId};
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const items = await MyItem.find(filterQuery)
            .skip(skip)
            .limit(parseInt(pageSize))
            .exec();
        const totalCount = await MyItem.countDocuments(filterQuery);
        res.status(200).json({ data: items, totalCount, currentPage: parseInt(page), pageSize: parseInt(pageSize) });
    } catch (err) {
        console.error('Error fetching all items:', err);
        res.status(500).json({ message: 'Failed to fetch items. Please try again later.' });
    }
});
router.get('/myitem', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { searchTerm, exactMatch, date, page = 1, pageSize = 4 } = req.query;
        const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
        filterQuery.userId = userId;
        filterQuery.isBlocked = { $ne: true };
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const items = await MyItem.find(filterQuery)
            .skip(skip)
            .limit(parseInt(pageSize))
            .exec();
        const totalCount = await MyItem.countDocuments(filterQuery);
        res.status(200).json({ data: items, totalCount, currentPage: parseInt(page), pageSize: parseInt(pageSize) });
    } catch (err) {
        console.error('Error fetching my items:', err);
        res.status(500).json({ message: 'Failed to fetch items. Please try again later.' });
    }
});


// Block an item
router.patch('/block/:id', async (req, res) => {
    const { id } = req.params; // Item ID to block
    try {
        // Convert the item ID to ObjectId
        const itemId = new mongoose.Types.ObjectId(id);

        // Update the isBlocked field in the Items collection
        const updatedItem = await MyItem.findByIdAndUpdate(
            itemId,
            { isBlocked: true },
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update the corresponding trades where the item is involved (item1 or item2)
        const updatedTrades = await trades.updateMany(
            {
                $or: [
                    { 'item1._id': id }, // Match item1._id with the given id
                    { 'item2._id': id }  // Match item2._id with the given id
                ]
            },
            {
                $set: {
                    'item1.isBlocked': true,
                    'item2.isBlocked': true
                }
            }
        );

        res.status(200).json({
            message: 'Item successfully blocked',
            updatedItem,
            updatedTrades
        });
    } catch (error) {
        console.error('Error blocking item:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

// Unblock an item
router.patch('/unblock/:id', async (req, res) => {
    const { id } = req.params; // Item ID to unblock
    try {
        // Convert the item ID to ObjectId
        const itemId = new mongoose.Types.ObjectId(id);

        // Update the isBlocked field in the Items collection
        const updatedItem = await MyItem.findByIdAndUpdate(
            itemId,
            { isBlocked: false },
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update the corresponding trades where the item is involved (item1 or item2)
        const updatedTrades = await trades.updateMany(
            {
                $or: [
                    { 'item1._id': id }, // Match item1._id with the given id
                    { 'item2._id': id }  // Match item2._id with the given id
                ]
            },
            {
                $set: {
                    'item1.isBlocked': false,
                    'item2.isBlocked': false
                }
            }
        );

        res.status(200).json({
            message: 'Item successfully unblocked',
            updatedItem,
            updatedTrades
        });
    } catch (error) {
        console.error('Error unblocking item:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

module.exports = router;

  
module.exports = router;
