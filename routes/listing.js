const express =require("express");
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema, reviewSchema}=require('../schema.js');
const Listing=require('../models/listing.js');


const validationListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  
if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(404,errMsg)
}else{
  next(); 
}
};

//IndexRoute

router.get('/',wrapAsync(async(req,res)=>{
const allListings=await Listing.find({});
res.render('./listings/index.ejs',{allListings});
}));
//New Route

router.get('/new',(req,res)=>{
  res.render('./listings/new.ejs')
});

//show route

router.get('/:id',wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if(!listing){
    req.flash("error","Listing you request does not exist!");
   return res.redirect('/listings');
  }
  res.render('./listings/show.ejs',{listing});
}));


//Create Route

router.post('/',validationListing,wrapAsync(async(req,res,next)=>{

    const newlistings=new Listing(req.body.listing);
    await newlistings.save();
    req.flash("success","New Listings is Created!");
    res.redirect('/listings');
}));

//editRoute

router.get('/:id/edit',wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you request does not exist!");
   return res.redirect('/listings');
  }
  res.render('./listings/edit.ejs',{listing});
}));

//UpdateROute

router.put('/:id',validationListing,wrapAsync(async (req,res) => {
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//DELETE POST

router.delete('/:id',wrapAsync(async(req,res)=>{
  let {id}=req.params;
 const newdelete= await Listing.findByIdAndDelete(id);
 console.log(newdelete);
 req.flash("success","Listings Deleted!");
  res.redirect('/listings')
}));

module.exports = router;