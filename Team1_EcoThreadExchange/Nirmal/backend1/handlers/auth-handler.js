const User=require("./../db/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");



async function registerUser(model){
    const hashPassword=await bcrypt.hash(model.password,10);
    let user=new User({
        name:model.name,
        email:model.email,
        password:hashPassword,
        
    });
    await user.save();
}

async function loginUser(model) {
    const user=await User.findOne({email:model.email});
    if(!user){
        return null;
    }
    if (user.isSuspended) {
        return { error: 'User is suspended' };
    }
    const isMatched=await bcrypt.compare(model.password,user.password);
    if(isMatched){
        const token=jwt.sign({
            id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
        },"seceret",{
            expiresIn:"1h"
        });
        return{token,user};
    }
    else{
        return null;
    }
}



// userController.js


// Suspend or Unsuspend user
exports.toggleSuspend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Toggle the suspension status
    user.isSuspended = !user.isSuspended;
    await user.save();

    return res.status(200).json({ message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports={registerUser,loginUser}