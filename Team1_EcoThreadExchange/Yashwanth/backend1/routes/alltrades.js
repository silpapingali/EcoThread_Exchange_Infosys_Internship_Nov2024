const express = require('express');
const router = express.Router();
const MyTrade = require('../db/alltrades'); 
const { verifyToken } = require('../middleware/auth-middleware');
const mongoose = require('mongoose');
const Trade=require("./../db/alltrades");
const {getAllTrades,getTrade}=require("../handlers/all-trades-handler.ts")
const { getAllItems,buildFilterQuery } = require('../handlers/all-items-handler'); 




router.get("/trade/:id",async(req,res)=>{
    let id=req.params["id"];
    let trade=await getTrade(id);
    res.send(trade);
});

router.get('/mytrade', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { searchTerm, exactMatch, date, page = 1, pageSize = 4 } = req.query;
        const filterQuery = buildFilterQuery({ searchTerm, exactMatch, date });
        filterQuery.userId = userId; 
        filterQuery.isBlocked = { $ne: true }; 
      const skip = (page - 1) * pageSize;
      const trades = await MyTrade.find(filterQuery).skip(skip).limit(pageSize).exec();
      const totalItems = await MyTrade.countDocuments(filterQuery);
      res.status(200).json({
        data: trades,
        totalCount: totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
      });
    } catch (error) {
      console.error('Error fetching my trades:', error);
      res.status(500).json({ message: 'Failed to fetch trades. Please try again later.' });
    }
  });
  
  
  
  
module.exports = router;
