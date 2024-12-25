const User = require("../models/user");

module.exports.getSigUp = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.postSignUp = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const newUser = new User({ email, username });
        let newRegisteredUser = await User.register(newUser, password);
        req.logIn(newRegisteredUser, (err) => {
            if (err) {
                return next();
            }
            req.flash("success", `${username} SignedUp Successfully`);
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};


module.exports.getLogin =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "You are successfully logout!");
        res.redirect("/listings");
    });
};


module.exports.postLogin = (req, res) => {
    req.flash("success", "Welcome to Wanderlust!.")
    res.redirect(res.locals.redirectUrl);
};