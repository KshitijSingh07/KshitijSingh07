const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");


app.use(session({ secret: "Mysecretcode", resave: false, saveUninitialized: true}));
app.use(cookieParser("secretcode"));


app.listen(3000, (req,res)=>{
    console.log("App is listening on port 3000");
});

app.get("/", (req, res)=>{
    res.send("Hi!, I am rooot.");
});

app.get("/getcookies", (req, res)=>{
    res.cookie("name", "Kshitij", {signed: true});
    res.send("Cookie have been send.");
});

app.get("/greet",(req, res)=>{
    const {name = "anonymous"} = req.cookies;
    console.log(req.signedCookies);
    res.send(`Hi! ${name}`);
})

app.get('/count', (req, res)=>{
    if (req.session.count) {
        req.session.count++
    } else {
        req.session.count = 1;
    }
    
    res.send(`You sent a request ${req.session.count} times.`);
});