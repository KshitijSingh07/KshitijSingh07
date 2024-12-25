const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, wrapAsync, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");




router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.delete));

//review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));


module.exports = router;