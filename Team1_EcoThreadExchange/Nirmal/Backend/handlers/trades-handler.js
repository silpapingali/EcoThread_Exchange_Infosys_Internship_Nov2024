const Trade=require("./../db/alltrades")

async function getAllTrades(){
    let trades=await Trade.find();
    return trades.map((x)=>x.toObject());
}
async function getTrade(id){
    let trade=await Trade.findById(id);
    return trade.toObject();
}
async function updateTrade(id,model){
    let trade=await Trade.findByIdAndUpdate(id,model);
    await trade.save();
}
async function getTradesForSearch(searchTerm){
    let queryFilter={};
    if(searchTerm){
        queryFilter.$or=[
            {
                title:{$regex:"."+searchTerm+".", $options: 'i'},
            },
            {
                size:{$regex:"."+searchTerm+".", $options: 'i'},
            },
            {
                condition:{$regex:"."+searchTerm+".", $options: 'i'},
            },
            {
                preferences:{$regex:"."+searchTerm+".", $options: 'i'},
            },{
                offeredBy:{$regex:"."+searchTerm+".",$options:'i'},
            }
        ]
    }
    const trades=await Trade.find(queryFilter);
    return trades.map((x)=>x.toObject()); 
}

module.exports={getAllTrades,getTrade,getTradesForSearch,updateTrade};