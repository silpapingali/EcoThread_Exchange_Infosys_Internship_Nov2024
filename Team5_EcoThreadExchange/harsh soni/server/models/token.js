const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Token schema to store user verification tokens
const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",  // Reference to the User model
    unique: true,  // Ensures only one token per user
  },
  token: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 3600  // Expiration time (1 hour)
  },
});

module.exports = mongoose.model("Token", tokenSchema);
