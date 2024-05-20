const express=require("express")
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js");
const usercontroller=require("../controller/users.js")

router
   .route("/signup")
   .get(usercontroller.renderSignupForm)
   .post(wrapAsync(usercontroller.signup))
router
   .route("/login")
   .get(usercontroller.renderLoginForm)
   .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFalsh:true}),usercontroller.login)

router.get("/logout",usercontroller.logout)
module.exports=router;