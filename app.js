const express =require('express');
const mongoose=require('mongoose');
const app =express();
const Listing=require('../MajorProject/models/listing.js');
const path =require('path');
app.use(express.urlencoded({extended:true}))
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
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


app.get('/listings',async(req,res)=>{
const allListings=await Listing.find({});
res.render('./listings/index.ejs',{allListings});
})
//New Route
app.get('/listings/new',(req,res)=>{
  res.render('./listings/new.ejs')
}),

//show route
app.get('/listings/:id',async(req,res)=>{
  let {id} =req.params;
  const listing=await Listing.findById(id)
  res.render('./listings/show.ejs',{listing});
});

//Create Route
app.post('/listings',async(req,res)=>{
// let listing=req.body.listing;
const newlistings=new Listing(req.body.listing);
await newlistings.save();
res.redirect('/listings');
})

//editRoute
app.get('/listings/:id/edit',async(req,res)=>{
  let {id} =req.params;
  const listing=await Listing.findById(id)
  res.render('./listings/edit.ejs',{listing});
})

//UpdateROute
app.put('/listings/:id',async (req,res) => {
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`);
})
//DELETE POST
app.delete('/listings/:id',async(req,res)=>{
  let {id}=req.params;
 const newdelete= await Listing.findByIdAndDelete(id);
 console.log(newdelete);
  res.redirect('/listings')
})


app.get('/',(req,res)=>{
  res.send('working');
})