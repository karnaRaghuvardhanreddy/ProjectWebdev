const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../Schema.js")
const Review=require("../models/review.js");
const listings=require("../models/listing.js")
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controller/review.js")

// Reviews Adding
// Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// Delete Route
router.delete("/:reviewId",isReviewAuthor,isLoggedIn,wrapAsync(reviewController.destroyReview))


module.exports=router