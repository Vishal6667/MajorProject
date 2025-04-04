const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const listingSchema=new Schema({
title:
{type:String,
  required:true
},
  description:String,
  image: {
    type: String,
    default:
      "https://amazingarchitecture.com/storage/files/1/architecture-firms/amin-moazzen/black-fly/black_house_amin_moazzen_bangal_india-3.jpg",
    set: (v) =>
      v === ""
        ? "https://amazingarchitecture.com/storage/files/1/architecture-firms/amin-moazzen/black-fly/black_house_amin_moazzen_bangal_india-3.jpg"
        : v,
  }
   
  ,
  price:Number,
  location:String,
  country:String
});
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;