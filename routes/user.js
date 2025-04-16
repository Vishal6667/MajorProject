const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listing');
const { trusted } = require('mongoose');
const passport=require('passport');

router.get("/signup",(req,res)=>{
  res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
  try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registedUser=await User.register(newUser,password)
    console.log(registedUser);
    req.flash("success",`${req.body.username} welcome to wanderlust`);
    res.redirect('/listings');
  }catch(err){
    req.flash("error",`${req.body.username} Username is already exits` );
    res.redirect("/signup")
  }
})
);

router.get('/login',(req,res)=>{
  res.render("users/login.ejs")
})

router.post("/login", passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
  let {username}=req.body;
  req.flash("success",`${req.body.username} welcome  back to wanderlust`);
  res.redirect("/listings");
})

module.exports= router;