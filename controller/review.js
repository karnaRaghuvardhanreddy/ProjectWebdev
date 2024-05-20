const listings=require("../models/listing")
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    let listing =await listings.findById(req.params.id);
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id;
    let result=await listing.reviews.push(newReview)
    await listing.save();
    await newReview.save();
    req.flash("success","new review added");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`)
}