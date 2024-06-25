const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Pitch = require("./models/pitch");
const Joi = require("joi")
const {pitchSchema,reviewSchema} = require("./schemas");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/expressError");
const methodOverride = require('method-override');
const path = require("path");
const Review = require("./models/review");

// Mongoose setup
mongoose.connect('mongodb://localhost:27017/pitch-review')
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
const validatePitch = (req, res, next) => {
    const { error } = pitchSchema.validate(req.body);
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

app.get("/pitches", catchAsync(async (req, res) => {
    const pitches = await Pitch.find({});
    res.render("pitches/index", { pitches });
}));

app.get("/pitches/new", (req, res) => {
    res.render("pitches/new");
});

app.post("/pitches", validatePitch, catchAsync(async (req, res) => {
    const pitch = new Pitch(req.body.pitch);
    await pitch.save();
    res.redirect(`/pitches/${pitch._id}`);
}));

app.get("/pitches/edit/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);
    res.render("pitches/edit", { pitch });
}));

app.get("/pitches/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id).populate("reviews");
    res.render("pitches/details", { pitch });
}));

app.patch("/pitches/:id", validatePitch, catchAsync(async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findByIdAndUpdate(id, req.body.pitch, { new: true });
    res.redirect(`/pitches/${pitch._id}`);
}));

app.delete("/pitches/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Pitch.findByIdAndDelete(id);
    res.redirect("/pitches");
}))

app.post("/pitches/:id/reviews", validateReview, catchAsync(async (req,res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);

    const review = new Review(req.body.review);
    pitch.reviews.push(review);
    await review.save();
    await pitch.save();
    res.redirect(`/pitches/${id}`);
}))

app.delete("/pitches/:pitchID/reviews/:reviewID", catchAsync(async (req,res) => {
    const {pitchID , reviewID} = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Pitch.findByIdAndUpdate(pitchID, {$pull: {reviews: reviewID}});
    res.redirect(`/pitches/${pitchID}`);
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
