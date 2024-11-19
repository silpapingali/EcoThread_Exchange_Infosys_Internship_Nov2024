const express=require("express");
const { registerUser, loginUser } = require("../handlers/auth-handler");
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const User=require('../db/user');
const router=express.Router();

/*
router.post("/register",async(req,res)=>{
    let model=req.body;
    if(model.name&& model.email && model.password){
        await registerUser(model);
        res.send({
            message:"User registered",
        });
    }
    else{
        res.status(400).json({
            error:"Please provide name,email and password",
            
        });
    }
});


*/
const EMAIL_USER = 'shaanvi674@gmail.com';
const EMAIL_PASS = 'bxyr uvyv kiuo qncw';

router.post('/reset-password', async(req, res) => {
    const { email } = req.body;
    try{
        const resetLink=http://localhost:4200/reset-password;
        const transporter=nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service:'gmail',
            auth:{
                user:EMAIL_PASS,
                pass:EMAIL_PASS,
            }
        });
        const mailOptions={
            from:EMAIL_USER,
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

        const activationLink=http://localhost:4200/login;
        const transporter=nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service:'gmail',
            auth:{
                user:EMAIL_USER,
                pass:EMAIL_PASS,
            },
        });
        const mailOptions={
            from:EMAIL_USER,
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
