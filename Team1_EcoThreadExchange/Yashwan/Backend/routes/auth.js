const express=require("express");
const { registerUser, loginUser } = require("../handlers/auth-handler");
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const User=require('../db/user');
const router=express.Router();


router.post('/reset-password', async(req, res) => {
    const { email } = req.body;
    try{

        const resetLink ='http://localhost:4200/reset-password';
        const transporter=nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service:'gmail',
            auth:{
                user:'nirmal01r21@gmail.com',
                pass:'uxqw nrzg zzdz bhfa'
            }
        });
        const mailOptions={
            from:'nirmal01r21@gmail.com',
            to:email,
            subject:'Reset Link for Password',
            html:`
            <h2>Hi ${email} Welcome to Ecothread Exchange Clothing For Sustainable Tommorrow </h2>
            <p>Please click the below link to reset your password:</p>
            <b><a href="${resetLink}">Reset Password</a></b>
            `
        };
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.error(error);
                return res.status(500).json({message:'Error sending email'});
            }
            console.log('Email sent:'+info.response);
            res.status(201).json({
                message:'Please check your email for reset link'
            });
        });

    }catch (error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

//  Reset Password API
router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the email exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update password in the database
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
  });
        

//  Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log('User not found:', email);
            return res.status(400).send({ message: 'User not found.' });
        }
        console.log('User from DB:', user);
        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        if (isMatch) {
            res.status(200).send({ message: 'Login successful.' });
        } else {
            res.status(400).send({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error during login.', error });
    }
});
  
router.post('/register',async (req,res)=>{
    const {name,email,password}=req.body;

    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({name,email,password:hashedPassword});
        await newUser.save();
        /* gmail setting and gmail activation link  */
        const activationLink=`http://localhost:4200/login`;
        const transporter=nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service:'gmail',
            auth:{
                user:'yashwanth9182444@gmail.com',
                pass:'wolc bgvg emqr rxns'
            }
        });
       
        const mailOptions={
            from:'yashwanth9182444@gmail.com',
            to:email,
            subject:'Activate Your Ecothread Exchange-clothing Account',
            html:`
            <h2>Hi ${name} Welcome to Ecothread Exchange Clothing For Sustainable Tommorrow </h2>
            <p>Please click the below link to activate your account:</p>
            <b><a href="${activationLink}">Activate Account</a></b>
            `
        };
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.error(error);
                return res.status(500).json({message:'Error sending email'});
            }
            console.log('Email sent:'+info.response);
            res.status(201).json({
                message:'User registered successfully.Please check your email for activation link'
            });
        });

        
            

    }catch (error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});


















router.post("/login",async(req,res)=>{
    let model=req.body;
    if(model.email && model.password){
        const result=await loginUser(model);
        if(result){
            res.send(result);
        }
        else{
            res.status(400).json({
                error:"Email or Password is incorrect",
                
            })
        }
    }
    else{
        res.status(400).json({
            error:"Please provide email and password",
            
        })
    }
})

module.exports=router;