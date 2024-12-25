const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateListing, wrapAsync } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// database testing route
// app.get("/testListing", (req, res) => {
//     const listingData = {
//         title: "Luxury Apartment in Manhattan",
//         description: "A spacious 3-bedroom apartment with stunning city views and modern amenities.",
//         Image: "https://example.com/images/luxury-apartment.jpg",
//         filename: "luxury-apartment.jpg",
//         url: "https://example.com/uploads/luxury-apartment.jpg",
//         price: 5000000,
//         location: "Manhattan, New York",
//         country: "United States"
//     };
//     const u1 = listing(listingData);
//     u1.save()
//     .then(()=>{console.log("Data entered")})
//     .catch((err)=>{console.log(err)});
//     res.send("Working");
// });



router.route("/")
// index route
.get(wrapAsync(listingController.index))
// post req for creations
.post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.postCreate));


// create route
router.get("/new", isLoggedIn, wrapAsync(listingController.getCreate));


router.route("/:id")
// show route
.get(wrapAsync(listingController.show))
// edit route
.put(isLoggedIn, isOwner ,upload.single('listing[image]'),validateListing,wrapAsync(listingController.postEdit))
// delete route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));


// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.getEdit));


module.exports = router;