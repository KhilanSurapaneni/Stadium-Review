const express = require("express");
const router = express.Router({mergeParams: true}); //allows us to use params from prefix here
const catchAsync = require('../utils/catchAsync');
const Stadium = require("../models/stadium");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const { add_review, delete_review } = require("../controllers/reviews");




router.route("/")
    .post(isLoggedIn, validateReview, catchAsync(add_review));

router.route("/:reviewID")
    .delete(isLoggedIn, isReviewAuthor, catchAsync(delete_review));

module.exports = router;