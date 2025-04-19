const express =require("express");
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema}=require('../schema.js');
const Listing=require('../models/listing.js');
const {isLoggedIn, isOwner,validationListing}=require('../middleware.js');


//IndexRoute

router.get('/',wrapAsync(async(req,res)=>{
const allListings=await Listing.find({});
res.render('./listings/index.ejs',{allListings});
}));
//New Route

router.get('/new', isLoggedIn,(req,res)=>{
 
  res.render('./listings/new.ejs')

});

//show route

router.get('/:id',wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing = await Listing.findById(id).populate({path:'reviews',
    populate:{
      path:"author",
    }
  }).populate("owner");
  if(!listing){
    req.flash("error","Listing you request does not exist!");
   return res.redirect('/listings');
  }
  // console.log(listing);
  res.render('./listings/show.ejs',{listing});
}));


//Create Route

router.post('/', isLoggedIn,validationListing,wrapAsync(async(req,res,next)=>{

    const newlistings=new Listing(req.body.listing);
    newlistings.owner=req.user._id;
    await newlistings.save();
    req.flash("success","New Listings is Created!");
    res.redirect('/listings');
}));

//editRoute

router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you request does not exist!");
   return res.redirect('/listings');
  }
  res.render('./listings/edit.ejs',{listing});
}));

//UpdateROute

router.put('/:id', isLoggedIn,isOwner, validationListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you are trying to update doesn't exist!");
    return res.redirect('/listings');
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));


//DELETE POST

router.delete('/:id', isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
  let {id}=req.params;
 const newdelete= await Listing.findByIdAndDelete(id);
 console.log(newdelete);
 req.flash("success","Listings Deleted!");
  res.redirect('/listings')
}));

module.exports = router;