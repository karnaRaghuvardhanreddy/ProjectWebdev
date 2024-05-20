const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
//const { listingSchema, reviewSchema } = require("../Schema.js");
//const ExpressError=require("../utils/ExpressError.js")
//const listings=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controller/listings.js")
//const listingController=require("../controller/listing.js");
const { index } = require("../controller/listings.js");
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})


router
  .route("/")
  //index route
  .get(wrapAsync(index))
  //create route 
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
router.get("/new",isLoggedIn,listingController.renderNewform)
router
   .route("/:id")
   //show route
   .get(wrapAsync(listingController.showListing))
   //update route
   .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
   //delete route
   .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

module.exports=router;