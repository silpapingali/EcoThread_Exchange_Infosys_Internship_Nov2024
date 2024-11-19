const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isAdmin:Boolean,
    isActivated:{Boolean} 
});
const User=mongoose.model("users",userSchema);
module.exports=User;