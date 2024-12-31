const Trade=require("./../db/alltrades");


async function getAllTrades(){
    let trades=await Trade.find();
    return trades.map((x)=>x.toObject());
}
async function getTrade(id){
    let trade=await Trade.findById(id);
    return trade.toObject();
}







module.exports={getAllTrades,getTrade};