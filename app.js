const express =require('express');
const mongoose=require('mongoose');
const app =express();
const Listing=require('../MajorProject/models/listing.js');
const path =require('path');
app.use(express.urlencoded({extended:true}))
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js')
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const {listingSchema, reviewSchema}=require('./schema.js');
const Review =require('../MajorProject/models/reviews.js')

// const imageUrl = decodeURIComponent(req.body.image);



main().then(()=>{
  console.log('conntect to DB');

}).catch((err)=>{
  console.log('error')
})

async function main() {
  await mongoose.connect(MONGO_URL);
}
// app.get('/testListing',async(req,res)=>{
//   let sampleListing=new Listing({
//     title:"my new vila",
//     description:'By the beach',
//     price:324234,
//     location:'up',
//     country:'India'
//   });
// await sampleListing.save();
// console.log('sample was saved');
// res.send('saved');
 
// });
app.listen(8080,()=>{
  console.log("app listing");
});

app.use(express.static(path.join(__dirname,'/public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);


const validationListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  
if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(404,errMsg)
}else{
  next(); 
}
};


const validationReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  
if(error){
  let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(404,errMsg)
}else{
  next(); 
}
};

//IndexRoute

app.get('/listings',wrapAsync(async(req,res)=>{
const allListings=await Listing.find({});
res.render('./listings/index.ejs',{allListings});
}));
//New Route

app.get('/listings/new',(req,res)=>{
  res.render('./listings/new.ejs')
});

//show route

app.get('/listings/:id',wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing = await Listing.findById(req.params.id).populate('reviews');
  res.render('./listings/show.ejs',{listing});
}));

//Create Route

app.post('/listings',validationListing,wrapAsync(async(req,res,next)=>{

    const newlistings=new Listing(req.body.listing);
    await newlistings.save();
    res.redirect('/listings');
}));

//editRoute

app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing=await Listing.findById(id)
  res.render('./listings/edit.ejs',{listing});
}));

//UpdateROute

app.put('/listings/:id',validationListing,wrapAsync(async (req,res) => {
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`);
}));

//DELETE POST

app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  let {id}=req.params;
 const newdelete= await Listing.findByIdAndDelete(id);
 console.log(newdelete);
  res.redirect('/listings')
}));

//Reviews
app.post("/listings/:id/reviews",validationReview,wrapAsync(async(req,res)=>{
  const listing=await Listing.findById(req.params.id);
  const newReview=new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  
  res.redirect(`/listings/${listing._id}`)
}));

//Delete reviews

app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review document
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
})


app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{err})
// res.status(statusCode).send(message);
})

app.get('/',(req,res)=>{
  res.send('working');
})