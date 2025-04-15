const express =require("express");
  const router= express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const { reviewSchema}=require('../schema.js');
const Review = require('../models/reviews.js');
const Listing=require('../models/listing.js');

const validationReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  
if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(404,errMsg)
}else{
  next(); 
}
};

//Reviews
router.post("/",validationReview,wrapAsync(async(req,res)=>{
  const listing=await Listing.findById(req.params.id);
  const newReview=new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success"," New Review Created!");
  
  res.redirect(`/listings/${listing._id}`)
}));

//Delete reviews

router.delete('/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review document
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");

  res.redirect(`/listings/${id}`);
}));
module.exports=router;