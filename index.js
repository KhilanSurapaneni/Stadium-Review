if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

// Express Setup
const express = require("express");
const app = express();


// Mongoose setup
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/stadium-review')
    .then(() => {
        console.log("CONNECTED TO MONGO!!!");
    })
    .catch(err => {
        console.log("ERROR CONNECTING TO MONGO!!!");
        console.log(err);
    });


//Requiring Path for EJS
const path = require("path");

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//allowing you to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Requiring Method Override to do delete and patch requests on EJS
const methodOverride = require('method-override');
app.use(methodOverride('_method'))


// Express Middleware to Parse Requests
app.use(express.urlencoded({ extended: true }));
;


//Express Session Setup
const session = require("express-session");
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    //options for cookies
    cookie: {
        expires: Date.now() + 1000*60*60*24*7, //expires in one week
        maxAge: 1000*60*60*24*7, //maxAge is one week
        httpOnly: true //this just adds a layer of security
    }
};
app.use(session(sessionConfig));

// Passport Setup

// Require necessary modules
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user"); // Assuming User model is defined in "./models/user"

// Initialize Passport middleware
app.use(passport.initialize()); // Initialize Passport to use in Express app
app.use(passport.session());    // Enable session support for Passport

// Configure Passport to use a LocalStrategy for authentication
passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy with User.authenticate method

// Serialize and deserialize user sessions
passport.serializeUser(User.serializeUser());   // Serialize user data to store in session
passport.deserializeUser(User.deserializeUser()); // Deserialize user data from session

//Flash Setup
const flash = require("connect-flash");
app.use(flash());
app.use((req,res,next) => {
    res.locals.currUser = req.user; // you have access to the user in every template, in order for this to work you need to define this below the passport setup
    res.locals.success = req.flash("success"); //we have access to this in every ejs
    res.locals.error = req.flash("error");
    next();
})


//Routes

//Home Route
app.get("/", (req, res) => {
    res.render("home");
});


//Stadium Routes
const stadiumRoutes = require("./routes/stadiums");
app.use("/stadiums", stadiumRoutes);
//User Routes
const userRoutes = require("./routes/user");
app.use("/", userRoutes);
//Review Routes
const reviewRoutes = require("./routes/reviews");
app.use("/stadiums/:id/reviews/", reviewRoutes);




//404 Error Routes
const ExpressError = require("./utils/expressError");
app.all("*", (req, res, next) => {
    return next(new ExpressError("Page not Found", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "There was an Error"
    }
    else if (!err.status) {
        err.status = 500;
    }
    res.status(status).render("error", { err });
});


//Opening the Port
app.listen(3000, () => {
    console.log("http://localhost:3000/");
});