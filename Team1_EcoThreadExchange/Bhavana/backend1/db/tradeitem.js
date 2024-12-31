const mongoose = require('mongoose');
// Define a schema for Trade Items
const tradeItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    size: { type: String, required: true },
    condition: { type: String, required: true },
    preferences: { type: [String], required: true },
    username: { type: String, required: true },
    image:  [String], // Stores the image file name
    createdOn: { type: Date, default: Date.now },
    userId: { type: String, required: true }, 
});

// Use the `tradeitems` collection
const TradeItem = mongoose.model('TradeItem', tradeItemSchema);
module.exports=TradeItem;