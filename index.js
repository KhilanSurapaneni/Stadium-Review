const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Stadium = require("./models/stadium");
const Joi = require("joi")
const {stadiumSchema,reviewSchema} = require("./schemas");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/expressError");
const methodOverride = require('method-override');
const path = require("path");
const Review = require("./models/review");

// Mongoose setup
mongoose.connect('mongodb://localhost:27017/stadium-review')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//middleware for validaion
const validateStadium = (req, res, next) => {
    const { error } = stadiumSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/stadiums", catchAsync(async (req, res) => {
    const stadiums = await Stadium.find({});
    res.render("stadiums/index", { stadiums });
}));

app.get("/stadiums/new", (req, res) => {
    res.render("stadiums/new");
});

app.post("/stadiums", validateStadium, catchAsync(async (req, res) => {
    const stadium = new Stadium(req.body.stadium);
    await stadium.save();
    res.redirect(`/stadiums/${stadium._id}`);
}));

app.get("/stadiums/edit/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    res.render("stadiums/edit", { stadium });
}));

app.get("/stadiums/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id).populate("reviews");
    res.render("stadiums/details", { stadium });
}));

app.patch("/stadiums/:id", validateStadium, catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndUpdate(id, req.body.stadium, { new: true });
    res.redirect(`/stadiums/${stadium._id}`);
}));

app.delete("/stadiums/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Stadium.findByIdAndDelete(id);
    res.redirect("/stadiums");
}))

app.post("/stadiums/:id/reviews", validateReview, catchAsync(async (req,res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);

    const review = new Review(req.body.review);
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    res.redirect(`/stadiums/${id}`);
}))

app.delete("/stadiums/:stadiumID/reviews/:reviewID", catchAsync(async (req,res) => {
    const {stadiumID , reviewID} = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Stadium.findByIdAndUpdate(stadiumID, {$pull: {reviews: reviewID}});
    res.redirect(`/stadiums/${stadiumID}`);
}))

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
