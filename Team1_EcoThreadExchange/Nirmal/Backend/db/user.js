const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isAdmin:Boolean,
    isActivated:{type: Boolean, default: false},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User=mongoose.model("users",userSchema);
module.exports=User;



module.exports = mongoose.model('Users', userSchema);
/* db schema */