const mongoose = require("mongoose");
// Mongoose setup
mongoose.connect('mongodb://localhost:27017/stadium-review')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

const path = require("path");
const express = require("express");
const app = express();
// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//allowing you to serve static files
app.use(express.static(path.join(__dirname, 'public')));

const methodOverride = require('method-override');

// Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//sessions
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

//flash
const flash = require("connect-flash");
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash("success"); //we have access to this in every ejs
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.render("home");
});

//requiring routes
const stadiums = require("./routes/stadiums");
const reviews = require("./routes/reviews");

app.use("/stadiums", stadiums);
app.use("/stadiums/:id/reviews/", reviews);



//this is for every path, will only run if nothing is matched
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

app.listen(3000, () => {
    console.log("http://localhost:3000/");
});
