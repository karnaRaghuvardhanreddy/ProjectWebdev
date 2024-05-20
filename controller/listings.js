const listings=require("../models/listing")
const { listingSchema, reviewSchema } = require("../Schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken})

module.exports.index=async (req, res) => {
    const alllistings = await listings.find({});
    res.render("listings/index", { alllistings });
}

module.exports.renderNewform=(req,res)=>{
    res.render("listings/new")
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params
    const listing=await listings.findById(id)
    .populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner")
    if(!listing){
        req.flash("error","Listing you requested for doesnot exist ")
        res.redirect("/listings")
    }
    res.render("listings/show",{listing})
}

module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()
    let url=req.file.path;
    let filename=req.file.filename;
    let result =listingSchema.validate(req.body);
    if(result.err){
        throw new ExpressError(400,result.error)
    }
    const newlsiting=new listings(req.body.listing)
    newlsiting.owner=req.user._id;
    newlsiting.image={url,filename}
    newlsiting.geometry=response.body.features[0].geometry;
    let savedlisting=await newlsiting.save()
    console.log(savedlisting)
    req.flash("success","New listing Created!")
    res.redirect("/listings")
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params
    const listing=await listings.findById(id)
    if(!listing){
        req.flash("error","Listing you requested for doesnot exist ")
        res.redirect("/listings")
    }
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit",{listing})
    }

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    //let listin=await listings.findById(id);
    let listing=await listings.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    const deleted=await listings.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");

}