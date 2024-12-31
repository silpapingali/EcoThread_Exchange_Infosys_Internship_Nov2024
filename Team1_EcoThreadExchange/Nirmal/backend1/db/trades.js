const mongoose = require('mongoose');
const User = require('./user'); 
const Item=require('./myitems')
const tradeSchema = new mongoose.Schema(
  {
    userId1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User, // Assuming you have a User model for the users
      required: true
    },
    userId2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true
    },
    item1: {
      type: Object,
      ref:Item,
      required: true
    },
    item2: {
      type: Object,
      ref:Item,
      required: true
    },
    
    isAccepted: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('Trade', tradeSchema);
