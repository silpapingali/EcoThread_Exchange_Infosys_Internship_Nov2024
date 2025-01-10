
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
          isBlocked :{ $ne: true },
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
      const isAdmin = req.user.isAdmin;
        const { searchTerm, exactMatch, date, page = 1, pageSize = 4 } = req.query;
        const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
        filterQuery.userId={$ne:userId};
        if (!isAdmin) {
            filterQuery.isBlocked = { $ne: true }; // Exclude blocked items for regular users
        }
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
/*
router.get('/myitem', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { searchTerm, exactMatch, date, page = 1, pageSize = 4 } = req.query;
        const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
        filterQuery.userId = userId;
        filterQuery.isTraded= { $ne: true };
        //filterQuery.isBlocked = { $ne: true };
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


      // Make sure we filter out blocked and already proposed items
      filterQuery.isBlocked = { $ne: true };  // Exclude blocked items
      filterQuery.isTraded = { $ne: true };  // Exclude already proposed items
  
*/



router.get('/myitem', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;  // Get the userId from token or session
      const { searchTerm, exactMatch, date, page = 1, pageSize = 10 } = req.query;
  
      const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
      filterQuery.userId = userId; // Make sure to fetch only the user's items
      const skip = (parseInt(page) - 1) * parseInt(pageSize);
  
      const items = await MyItem.find(filterQuery)
        .skip(skip)
        .limit(parseInt(pageSize))
        .exec();
  
      const totalCount = await MyItem.countDocuments(filterQuery);
  
      // Return items with pagination info
      res.status(200).json({ data: items, totalCount, currentPage: parseInt(page), pageSize: parseInt(pageSize) });
    } catch (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ message: 'Failed to fetch items. Please try again later.' });
    }
  });
  


  router.get('/myitemforpropose', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;  // Get the userId from token or session
      const { searchTerm, exactMatch, date, page = 1, pageSize = 10 } = req.query;
  
      const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
      filterQuery.userId = userId; // Make sure to fetch only the user's items
       // Make sure we filter out blocked and already proposed items
       filterQuery.isBlocked = { $ne: true };  // Exclude blocked items
       filterQuery.isTraded = { $ne: true };  // Exclude already proposed items
   
      const skip = (parseInt(page) - 1) * parseInt(pageSize);
  
      const items = await MyItem.find(filterQuery)
        .skip(skip)
        .limit(parseInt(pageSize))
        .exec();
      const totalCount = await MyItem.countDocuments(filterQuery);
  
      // Return items with pagination info
      res.status(200).json({ data: items, totalCount, currentPage: parseInt(page), pageSize: parseInt(pageSize) });
    } catch (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ message: 'Failed to fetch items. Please try again later.' });
    }
  });
  




/*
router.patch('/block/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItem = await MyItem.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true } // Return the updated document
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const updatedTrades=await trades.updateMany({
            $or:[
                {'item1._id':updatedItem._id},
                {'item2._id':updatedItem._id},
            ],
        },{
            $set:{
                'item1.isBlocked':true,
                'item2.isBlocked':true,
            },
        });

        res.status(200).json({ message: 'Item successfully blocked', updatedItem,updatedTrades });

        
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});


router.patch('/unblock/:id', async (req, res) => {
    const  id  = req.params.id;
    try {
      const updatedItem = await MyItem.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      const updatedTrades=await trades.updateMany({
        $or:[
            {'item1._id':updatedItem._id},
            {'item2._id':updatedItem._id},
        ],
    },{
        $set:{
            'item1.isBlocked':false,
            'item2.isBlocked':false,
        },
    });

    res.status(200).json({ message: 'Item successfully unblocked', updatedItem,updatedTrades });
     
    } catch (error) {
      console.error('Error unblocking item:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});
 */

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

        

        res.status(200).json({
            message: 'Item successfully blocked',
            updatedItem
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

        

        res.status(200).json({
            message: 'Item successfully unblocked',
            updatedItem
        });
    } catch (error) {
        console.error('Error unblocking item:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

module.exports = router;

  
module.exports = router;
