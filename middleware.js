const listing = require("./models/listing.js");
const {listingSchema} = require("./validation/schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./validation/review.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You need to login first!");
       return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }else{
        res.locals.redirectUrl = "/listings"
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    const id = req.params.id;
    const listingown = await listing.findById(id);
   
    if(!listingown.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



module.exports.wrapAsync = function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => { next(err) });
    }
}

module.exports.validateListing = function validateListing(req, res, next) {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        next(new ExpressError(400, result.error));
    } else {
        next();
    }
}




module.exports.validateReview = function validateReview(req, res, next) {
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        next(new ExpressError(400, result.error));
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async(req, res, next)=>{
    const { id, reviewId } = req.params;
    const reviewAuthor = await review.findById(reviewId);
    if(!res.locals.currUser._id.equals(reviewAuthor.author._id)){
        req.flash("error", "You are not the author of this review.")
        return res.redirect(`/listings/${id}`);
    }
    next();
}