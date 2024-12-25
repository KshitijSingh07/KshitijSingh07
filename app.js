if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}


const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
const app = express();
const methodOverride = require("method-override");
const reviewsRouter = require("./routes/reviews.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const usersRouter = require("./routes/users.js");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const port = 3000;
// const Mongodb_URL = 'mongodb://127.0.0.1:27017/Wanderlust';
const DB_URL = process.env.DB_URL;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})
app.use(session({store:store,secret: process.env.SECRET, saveUninitialized: true, resave: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.err = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", usersRouter);
app.use(cookieParser("secretcode"));


store.on("error", ()=>{
console.log("Error in mongo session store.")
})


main().then(() => {
    console.log("Database connection sucessful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(DB_URL);
}

app.listen(port, () => {
    console.log(`App is listening on port ${port}]`)
});


function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => { next() });
    }
}






app.get("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;

    // Do not call next() here, as the response is already being sent
    if (!res.headersSent) {
        res.status(status).render("./listings/error.ejs", { status, message });
    } else {

    }
});