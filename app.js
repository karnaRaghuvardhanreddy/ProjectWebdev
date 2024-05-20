if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require('express')
const app=express();
const mongoose=require('mongoose')
//const listings=require("../models/listing.js ")
const path=require("path")
const methodoverride=require('method-override')
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./Schema.js")
const Review=require("./models/review.js");
const session=require("express-session")
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("ERROR ON MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})

const ListingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")

app.use(express.static(path.join(__dirname,"/public")))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.engine("ejs",ejsMate)

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL
        
    )
}

main().then(()=>{
    console.log("conected to db")
})
.catch((err)=>{
    console.log(err)
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})

app.use("/listings",ListingsRouter);
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter);

// Error Handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong "}=err;

    res.status(statusCode).render("error.ejs",{err})
})
