const mongoose = require('mongoose');

const User = require('./user'); 
const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  title: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  username:{type:String},
  preferences: { type: [String], required: true,default:[] },
  image: { type: [String]}, 
  isTraded: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
  isBlocked:{type:Boolean,default:false},
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;