const {reviewSchema,stadiumSchema} = require("./schemas");
const Stadium = require("./models/stadium");
const Review = require("./models/review");
const ExpressError = require("./utils/expressError")

const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){ //this method checks whether or not you are signed in (via Passport)
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
    next();
}

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

const isAuthor = async (req,res,next) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    if (req.user && !stadium.author.equals(req.user._id)){
        req.flash("error", `Error: You aren't authorized to do that`)
        return res.redirect(`/stadiums/${stadium._id}`);
    }
    next();
}

const isReviewAuthor = async (req,res,next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (req.user && !review.author.equals(req.user._id)){
        req.flash("error", `Error: You aren't authorized to do that`)
        return res.redirect(`/stadiums/${id}`);
    }
    next();
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

module.exports = {isLoggedIn, validateStadium, validateReview, isAuthor, isReviewAuthor};