
const express=require("express");
const router=express.Router();
const Trade=require("../db/alltrades");
const {getAllTrades,getTrade,getTradesForSearch,updateTrade}=require("../handlers/trades-handler")
router.get("/alltrade",async(req,res)=>{
    const { page = 1, pageSize = 4 } = req.query;
  try {
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(pageSize, 10);
    const skip = (pageNumber - 1) * pageLimit;
    const totalTrades = await Trade.countDocuments();
    const trades = await Trade.find()
      .skip(skip)
      .limit(pageLimit);
    res.json({
       trades,
       totalItems: totalTrades,
       page: pageNumber,
       pageSize: pageLimit,
     });
   } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching trades', error: err });
   }
});
router.get("/trade/:id",async(req,res)=>{
    let id=req.params["id"];
    let trade=await getTrade(id);
    res.send(trade);
});
router.put("/:id",async(req,res)=>{
    let model=req.body;
    let id=req.params["id"];
    await updateTrade(id,model);
    res.send({message:"updated"});
})
router.get("/trades",async(req,res)=>{
    const {searchTerm}=req.query;
    const trades=await getTradesForSearch(searchTerm);
    res.send(trades);
})
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
module.exports=router;