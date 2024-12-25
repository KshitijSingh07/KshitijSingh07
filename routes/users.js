const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userControllter = require("../controllers/user.js");

// router.get("/demouser", async (req, res) => {
//     const fakeUser = new User({
//         email: "random123@gamil.com",
//         username: "randomboy69"
//     });

//     let registerdUser = await User.register(fakeUser, "random@123");
//     res.send(registerdUser);
// });


router.route("/signup")
// get Signup route
.get(userControllter.getSigUp)
// post Signup route
.post( userControllter.postSignUp);

router.route("/login")
.get(userControllter.getLogin)
.post( saveRedirectUrl ,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userControllter.postLogin);

router.get("/logout", userControllter.logout);


module.exports = router;