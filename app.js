const express =require('express');
const mongoose=require('mongoose');
const app =express();
const path =require('path');
app.use(express.urlencoded({extended:true}))
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js')
const listings= require("./routes/listing.js");
const reviews= require("./routes/reviews.js");
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const session=require('express-session');
const flash=require('connect-flash');





main().then(()=>{
  console.log('conntect to DB');

}).catch((err)=>{
  console.log('error')
})

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.listen(8080,()=>{
  console.log("app listing");
});

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() +7 * 24 *60 *60 *1000,
    maxage:7 * 24 *60 *60 *1000,
    httpOnly:true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(express.static(path.join(__dirname,'/public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});
app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{err})
// res.status(statusCode).send(message);
})

app.get('/',(req,res)=>{
  res.send('working');
})