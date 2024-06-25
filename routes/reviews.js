const express = require("express");
const router = express.Router({mergeParams: true}); //allows us to use params from prefix here

const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/expressError");

const Stadium = require("../models/stadium");
const Review = require("../models/review");

const {reviewSchema} = require("../schemas");

const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req,res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);

    const review = new Review(req.body.review);
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    res.redirect(`/stadiums/${id}`);
}))

router.delete("/:reviewID", catchAsync(async (req,res) => {
    const {id , reviewID} = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Stadium.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    res.redirect(`/stadiums/${id}`);
}))

module.exports = router;