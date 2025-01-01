const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
    trim: true       
  },
  email: {
    type: String,
    required: true,  
    unique: true,     
    lowercase: true, 
    trim: true        
  },
  password: {
    type: String,
    required: true,   
    minlength: 6      
  },
  isAdmin: {
    type: Boolean,
    default: false   
  },
  isSuspended: {
    type: Boolean,
    default: false   
  },
  isActivated: {
    type: Boolean,
    default: false, // New field to track activation status
  },
  activationToken: {
    type:String,
  }
}, {
  timestamps: true  
});


const User = mongoose.model('User', userSchema);
module.exports = User;
