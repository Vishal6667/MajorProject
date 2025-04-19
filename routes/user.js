const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listing');
const { trusted } = require('mongoose');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get("/signup",(req,res)=>{
  res.render("users/signup.ejs");
})

// Signup

router.post("/signup",wrapAsync(async(req,res)=>{
  try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registedUser=await User.register(newUser,password)
    console.log(registedUser);
    req.login(registedUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success",`${req.body.username} welcome to wanderlust`);
      res.redirect('/listings');
    })
   
  }catch(err){
    req.flash("error",`${req.body.username} Username is already exits` );
    res.redirect("/signup")
  }
})
);

// Login

router.get('/login',(req,res)=>{
  res.render("users/login.ejs")
})

router.post("/login",saveRedirectUrl, 
  passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    async(req,res)=>{
    req.flash("success",`${req.body.username} welcome  back to wanderlust`);
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
});



// Logout
router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
     return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
});

module.exports= router;