const listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    // console.log(allListings);
    res.render("./listings/index.ejs", { allListings });
};


module.exports.postCreate = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listingarr = req.body.listing;
    const u = new listing(listingarr);
    u.image = {url, filename};
    u.owner = res.locals.currUser;
    await u.save()
        .then(() => {
            req.flash("success", "New listting created.");
            res.redirect("/listings");
        })
        .catch((err) => { next(err) });
};


module.exports.getCreate = (req, res) => {
    res.render("./listings/create.ejs");
};

module.exports.show = async (req, res) => {
    const id = req.params.id;
    const data = await listing.findById(id)
        .populate({
            path:"review", 
            populate:{path: "author"}})
        .populate("owner");
    // console.log(data);
    if (!data) {
        req.flash("error", "Listing does not exists");
        res.redirect("/listings");
    }
    // console.log(data);
    res.render("./listings/show.ejs", { data });
};



module.exports.getEdit = async (req, res) => {
    const id = req.params.id;
    const data = await listing.findById(id);
    // console.log(data);
    req.flash("success", "Edited listing");
    res.render("./listings/edit.ejs", { data });
};


module.exports.postEdit = async (req, res) => {
    const id = req.params.id;
    const listingarr = req.body.listing;
    if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listingarr.image = {url, filename};
    }
    await listing.findByIdAndUpdate(id, listingarr);
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await listing.findOneAndDelete({ _id: id });
    req.flash("success", "Listing deleted.");
    res.redirect("/listings");
};