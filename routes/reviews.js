const express =require("express");
  const router= express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Review = require('../models/reviews.js');
const Listing=require('../models/listing.js');
const {validationReview ,isLoggedIn, isReviewAuthor}=require('../middleware.js');


//Reviews
router.post("/",isLoggedIn,validationReview,wrapAsync(async(req,res)=>{
  const listing=await Listing.findById(req.params.id);
  const newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success"," New Review Created!");
  
  res.redirect(`/listings/${listing._id}`)
}));

//Delete reviews

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review document
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");

  res.redirect(`/listings/${id}`);
}));
module.exports=router;