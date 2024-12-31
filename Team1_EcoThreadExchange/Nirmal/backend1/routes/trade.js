const express=require("express");
const router=express.Router();
const Trade=require("./../db/alltrades");
const Item=require("./../db/myitems");
const TradeItem = require('../db/tradeitem');
const {getAllTrades,getTrade,updateTrade}=require("../handlers/trades-handler")
const { getAllItems,buildFilterQuery } = require('../handlers/all-items-handler'); 
const { verifyToken } = require('../middleware/auth-middleware');

const mongoose = require('mongoose');
const trades=require("./../db/trades");

// Route to propose a trade
router.post('/propose', verifyToken, async (req, res) => {
  const { userId1, userId2, item1, item2 } = req.body;

  // Step 1: Validate userId1 from token
  if (req.user.id !== userId2) {
    return res.status(400).send('User ID in the token does not match userId2.');
  }

  // Step 2: Validate the presence of all required fields
  if (
    !item1 ||
    !item1.title ||
    !item1.condition ||
    !item1.size ||
    !item1.preferences ||
    !item1.image
  ) {
    return res.status(400).send('Item1 is missing required fields.');
  }

  if (
    !item2 ||
    !item2.title ||
    !item2.condition ||
    !item2.size ||
    !item2.preferences ||
    !item2.image
  ) {
    return res.status(400).send('Item2 is missing required fields.');
  }


  // Step 3: Validate ownership of items
  if (item1.userId !== userId1 || item2.userId !== userId2) {
    return res.status(400).send('Item1 and Item2 do not belong to the correct users.');
  }

 
  try {
    // Step 5: Create a new trade proposal document
    const newTrade = new trades({
      userId1,
      userId2,
      item1,
      item2,
      status: 'pending', // Initially set the trade status to pending
    });

    // Step 6: Save the trade proposal to the database
    await newTrade.save();

    res
      .status(201)
      .send({ message: 'Trade proposal submitted successfully', trade: newTrade });
  } catch (error) {
    console.error('Error proposing trade:', error);
    res.status(500).send('Server error');
  }
});




router.get('/tradesbyuser', async (req, res) => {
    try {
        const offeredBy = req.query.offeredBy;
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = page * pageSize;
        const trades = await Trade.find({ offeredBy: offeredBy }) 
           .skip(skip) 
           .limit(pageSize)
        const total = await Trade.countDocuments({ offeredBy: offeredBy });
        res.json({
            trades: trades,
            total: total
    });
  } catch (error) {
        console.error('Error fetching trades:', error);
        res.status(500).json({ error: 'Internal Server Error' });
  }    
  });



// Route to fetch trades for the current user with pagination
router.get('/trades', verifyToken, async (req, res) => {
  const userId = req.user.id; // Current user's ID from the token
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page, default to 10
  const objectId = new mongoose.Types.ObjectId(userId);
  console.log('Fetching trades for user:', userId);
  console.log('Page:', page, 'PageSize:', pageSize);

  try {
    // Fetch trades proposed by the user (userId1)
    const tradesProposedByUser = await trades.find({ userId1: objectId })
    .populate('item1', 'title size condition preferences image username')
      .populate('item2', 'title size condition preferences image username')
      .populate('userId2', 'name')
      .skip((page - 1) * pageSize)
      .limit(pageSize);


    // Fetch trades proposed to the user (userId2)
    const tradesProposedToUser = await trades.find({ userId2: objectId })
    .populate('item1', 'title size condition preferences image username')
    .populate('item2', 'title size condition preferences image username')
    .populate('userId1', 'name')
    .skip((page - 1) * pageSize)
    .limit(pageSize);

    // Total number of trades (for pagination calculation)
    const totalTrades = await trades.countDocuments({
      $or: [{ userId1: userId }, { userId2: userId }],
    });


    // Return the trades and pagination information
    res.status(200).json({
      tradesProposedByUser,
      tradesProposedToUser,
      totalPages: Math.ceil(totalTrades / pageSize), // Calculate the total number of pages
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).send('Server error');
  }
});





// Route to update trade status
router.put('/trades/:tradeId/status', verifyToken, async (req, res) => {
  const { tradeId } = req.params;
  const { status } = req.body;
  const userId = req.user.id; // Current user's ID from the token
  const objectId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).send('Invalid status. Only accepted or rejected allowed.');
  }

  try {
    // Find the trade by ID
    const trade = await trades.findById(tradeId);

    if (!trade) {
      return res.status(404).send({ message: 'Trade not found', tradeId });
    }

    // Ensure only the recipient of the trade can update the status
    if (!trade.userId1.equals(objectId)) { // Compare ObjectId using .equals()
      return res
        .status(403)
        .send({ message: 'Only the recipient of the trade can update its status.', objectId });
    }

    // Update the trade status
    trade.status = status;
    await trade.save();

    res.status(200).send({ message: 'Trade status updated successfully.', trade });
  } catch (error) {
    console.error('Error updating trade status:', error);
    res.status(500).send('Server error');
  }
});





/*
// Route to fetch trades with multi-field search and pagination
router.get('/allnewtrades', async (req, res) => {
  const { search, exactMatch, postedAfter, page = 1, pageSize = 10 } = req.query;

  try {
    const filters = {};

    // Search across multiple fields
    if (search) {
      const regex = exactMatch === 'true' ? ^${search}$ : search;
      filters.$or = [
        { 'item1.title': { $regex: regex, $options: 'i' } },
        { 'item2.title': { $regex: regex, $options: 'i' } },
        { 'selectedPreference': { $regex: regex, $options: 'i' } },
        { 'userId1.username': { $regex: regex, $options: 'i' } },
        { 'userId2.username': { $regex: regex, $options: 'i' } },
      ];
    }

    // Filter by posted date
    if (postedAfter) {
      filters.createdAt = { $gte: new Date(postedAfter) };
    }

    // Pagination
    const limit = parseInt(pageSize);
    const skip = (parseInt(page) - 1) * limit;

    const allnewtrades = await trades.find(filters)
      .populate('userId1', 'username')
      .populate('userId2', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await trades.countDocuments(filters);

    res.status(200).send({
      allnewtrades,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).send({ message: 'Error fetching trades', error });
  }
});



// Route to fetch trades with multi-field search and pagination
router.get('/allnewtrades', async (req, res) => {
  const { search, exactMatch, postedAfter, page = 1, pageSize = 10 } = req.query;

  try {
    const filters = {};

    // Search across multiple fields
    if (search) {
      const regex = exactMatch === 'true' ? ^${search}$ : search;
      filters.$or = [
        { 'item1.title': { $regex: regex, $options: 'i' } },
        { 'item2.title': { $regex: regex, $options: 'i' } },
        { 'selectedPreference': { $regex: regex, $options: 'i' } },
        { 'userId1.username': { $regex: regex, $options: 'i' } },
        { 'userId2.username': { $regex: regex, $options: 'i' } },
      ];
    }

    // Filter by posted date
    if (postedAfter) {
      filters.createdAt = { $gte: new Date(postedAfter) };
    }

    // Pagination
    const limit = parseInt(pageSize);
    const skip = (parseInt(page) - 1) * limit;

    // Fetch trades and populate necessary fields
    const allnewtrades = await trades.find(filters)
      .populate('userId1', 'username')  // Populating userId1's username
      .populate('userId2', 'username')  // Populating userId2's username
      .populate('item1', 'title size condition isBlocked preferences image username') // Populating item1 with necessary fields
      .populate('item2', 'title size condition isBlocked preferences image username') // Populating item2 with necessary fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await trades.countDocuments(filters);

    res.status(200).send({
      allnewtrades,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).send({ message: 'Error fetching trades', error });
  }
});

*/


// Route to fetch all new trades with multi-field search, pagination, and user-specific trades
router.get('/allnewtrades', verifyToken, async (req, res) => {
  const userId = req.user.id; // Current user's ID from the token
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page, default to 10
  const skip = (page - 1) * pageSize;

  const { search, exactMatch, postedAfter } = req.query; // Search parameters from query
  console.log('Fetching trades for user:', userId);
  console.log('Page:', page, 'PageSize:', pageSize);

  try {
    const filters = {};

    // Search across multiple fields if search is provided
    if (search) {
      const regex = exactMatch === 'true' ? '^${search}$ ': search;
      filters.$or = [
        { 'item1.title': { $regex: regex, $options: 'i' } },
        { 'item2.title': { $regex: regex, $options: 'i' } },
        { 'item1.preferences': { $regex: regex, $options: 'i' } },
        { 'item2.preferences': { $regex: regex, $options: 'i' } },
        { 'userId1.username': { $regex: regex, $options: 'i' } },
        { 'userId2.username': { $regex: regex, $options: 'i' } },
      ];
    }

    // Filter by posted date if provided
    if (postedAfter) {
      filters.createdAt = { $gte: new Date(postedAfter) };
    }

    // Fetch trades proposed by the user (userId1)
    const tradesProposedByUser = await trades
      .find({ userId2: userId, ...filters })
      .populate('item1', 'title size condition isBlocked preferences image username')
      .populate('item2', 'title size condition isBlocked preferences image username')
      .populate('userId2', 'name')
      .skip(skip)
      .limit(pageSize);

    // Fetch trades proposed to the user (userId2)
    const tradesProposedToUser = await trades
      .find({ userId1: userId, ...filters })
      .populate('item1', 'title size condition preferences isBlocked image username')
      .populate('item2', 'title size condition preferences isBlocked image username')
      .populate('userId1', 'name')
      .skip(skip)
      .limit(pageSize);

    // Total number of trades (for pagination calculation)
    const totalTrades = await trades.countDocuments({
      $or: [{ userId1: userId }, { userId2: userId }],
      ...filters, // Apply the filters to the total count query
    });

    // Return the trades and pagination information
    res.status(200).json({
      tradesProposedByUser,
      tradesProposedToUser,
      totalPages: Math.ceil(totalTrades / pageSize), // Calculate the total number of pages
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).send('Server error');
  }
});








router.get('/recommendedtrades', verifyToken, async (req, res) => {
  try {
      const loggedInUserId1 = req.user.id; 
      
      const recommendedTrades = await trades
      .find({ userId1: loggedInUserId1})
          .limit(4) 
          .exec();  
      res.status(200).json({ data: recommendedTrades });
  } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({
          message: 'Failed to fetch recommendations',
          error: error.message,
      });
  }
});



module.exports=router;