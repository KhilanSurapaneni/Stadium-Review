const Stadium = require("../models/stadium");
const Review = require("../models/review");

const add_review = async (req,res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    res.redirect(`/stadiums/${id}`);
}

const delete_review = async (req,res) => {
    const {id , reviewID} = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Stadium.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    res.redirect(`/stadiums/${id}`);
}

module.exports = {add_review, delete_review}