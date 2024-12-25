const mongoose = require("mongoose");
const review = require("./review.js");





const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: String,
        url: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    review: {
        type: [mongoose.Types.ObjectId],
        ref: "review"
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    await review.deleteMany({ _id: { $in: listing.review } });
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;