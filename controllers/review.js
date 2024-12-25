const review = require("../models/review.js");
const listing = require("../models/listing.js");

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    const reviewAuthor = await review.findById(reviewId);
    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Successfully deleted.")
    res.redirect(`/listings/${id}`);
};


module.exports.postReview = async (req, res) => {
    const id = req.params.id;
    const reviewbody = req.body.review;
    reviewbody.author = res.locals.currUser;
    const u = await listing.findOne({ _id: id })
    const newReview = new review(reviewbody);
    await newReview.save();
    u.review.push(newReview);
    await u.save();
    res.redirect(`/listings/${id}`);
};