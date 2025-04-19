const Listing = require("./models/listing");
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema ,reviewSchema}=require('./schema.js');
const Review = require('./models/reviews.js');


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      //infomation 
      req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged in");
    return res.redirect("/login");
    
  }
  next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "you are not the owner of this post");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.validationListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  
if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(404,errMsg)
}else{
  next(); 
}
};

module.exports.validationReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  
if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(404,errMsg)
}else{
  next(); 
}
};


module.exports.isReviewAuthor=async(req,res,next)=>{

  let {id,reviewid}=req.params;
  let review = await Review.findById(reviewid);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you did not created this reviews");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
