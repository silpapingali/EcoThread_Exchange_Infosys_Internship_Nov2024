
const mongoose = require('mongoose');
const User = require('./user'); 
const myTradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, 
  image: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  preferences: [{ type: String, required: true }],
  offeredBy: [{ type: String }],
  isBlocked:{type:Boolean,default:false},
});

const MyTrade = mongoose.model('MyTrade', myTradeSchema);
module.exports = MyTrade;


