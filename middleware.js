const listings=require("./models/listing")
const { listingSchema, reviewSchema } = require("./Schema.js");
const ExpressError=require("./utils/ExpressError.js")
const Review=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing ")
        res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl="/listings";
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await listings.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {err}=listingSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}