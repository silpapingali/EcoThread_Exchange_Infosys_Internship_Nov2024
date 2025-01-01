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
  try {
    const { userId1, userId2, item1, item2 } = req.body;

    // Validate userId1 from token
    if (req.user.id !== userId2) {
      return res.status(400).send('User ID in the token does not match userId2.');
    }

    // Ensure `item1` and `item2` are provided
    if (!item1?._id || !item2?._id) {
      return res.status(400).send('Both item1 and item2 are required with valid IDs.');
    }

    // Convert item IDs to ObjectId
    const item1Id = new mongoose.Types.ObjectId(item1._id);
    const item2Id = new mongoose.Types.ObjectId(item2._id);

    // Fetch the items from the database
    const fetchedItem1 = await Item.findById(item1Id);
    const fetchedItem2 = await Item.findById(item2Id);

    if (!fetchedItem1 || !fetchedItem2) {
      return res.status(404).send('One or both items not found.');
    }

    // Validate ownership of items
    if (fetchedItem1.userId.toString() !== userId1 || fetchedItem2.userId.toString() !== userId2) {
      return res.status(403).send('Item ownership validation failed.');
    }

    // Update `isTraded` status in the items collection
    await Item.updateOne({ _id: item1Id }, { isTraded: true });
    await Item.updateOne({ _id: item2Id }, { isTraded: true });

    // Create a new trade proposal
    const newTrade = new trades({
      userId1: new mongoose.Types.ObjectId(userId1),
      userId2: new mongoose.Types.ObjectId(userId2),
      item1: item1Id,
      item2: item2Id,
      status: 'pending', // Initially set the trade status to pending
    });

    // Save the trade proposal to the database
    await newTrade.save();

    // Respond with the trade details
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

  // Validate status input
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Only "accepted" or "rejected" are allowed.' });
  }

  try {
    // Find the trade by ID
    const trade = await trades.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found', tradeId });
    }

    // Ensure only the recipient of the trade can update the status
    if (!trade.userId1.equals(objectId)) { // Compare ObjectId using .equals()
      return res
        .status(403)
        .json({ message: 'Only the recipient of the trade can update its status.', userId });
    }

    // Update the trade status
    trade.status = status;
    await trade.save();

    // If trade is rejected, we update the isTraded field of the items involved
    if (status === 'rejected') {
      await Item.findByIdAndUpdate(trade.item1, { isTraded: false });
      await Item.findByIdAndUpdate(trade.item2, { isTraded: false });
    }

    res.status(200).json({ message: 'Trade status updated successfully.', trade });
  } catch (error) {
    console.error('Error updating trade status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});







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
      .find({ userId1: loggedInUserId1 })
      .populate('item1', 'title image username') // Populate item1 fields (title and image)
      .populate('item2', 'title image username') // Populate item2 fields (title and image)
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