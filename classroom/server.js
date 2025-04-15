const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const session =require('express-session');
const flash=require("connect-flash");
const path =require('path');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));



const sessionOptions=(({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
})
);
app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
  res.locals.message2=req.flash("error");
  res.locals.message=req.flash("success");
  next();
})

app.get("/register",(req,res)=>{
 
let {name ="vishal"}=req.query;
req.session.name=name;
console.log(req.session.name);

if(name==="madam"){
  req.flash("error","user not registred");
}
else{
  req.flash('success','user registered successfully');
}

res.redirect('/hello');
});

app.get("/hello",(req,res)=>{
 
  res.render('page.ejs',{name:req.session.name});
});

// app.get("/",(req,res)=>{
//   res.send("test successfull");
// })

// app.get("/request" ,(req,res)=>{
//   if(req.session.count){
//     req.session.count++;
//   }
//   else{
//     req.session.count=1;
//   }
//   res.send(`you send a request ${req.session.count} x times`);
// })

// app.use(cookieParser());
// app.get("/get",(req,res)=>{
//   res.send("hello");
//   res.cookie("greet","hello");
// })
// app.get("/",(req,res)=>{
//   console.dir(req.cookies);
// })
app.listen(3000,()=>{
  console.log('server is running')
})

