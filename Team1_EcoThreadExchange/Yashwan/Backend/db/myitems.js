const mongoose = require('mongoose');

const User = require('./user'); 
const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  title: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  usename:{type:String},
  preferences: { type: [String], required: true },
  image: { type: String},  // Reference to the User model
  isTraded: { type: Boolean, default: false },  // Trade status
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;