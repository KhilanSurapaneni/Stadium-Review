const express = require("express");
const router = express.Router();
const Stadium = require("../models/stadium");
const {stadiumSchema} = require("../schemas");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/expressError");

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

router.get("/", catchAsync(async (req, res) => {
    const stadiums = await Stadium.find({});
    res.render("stadiums/index", { stadiums });
}));

router.get("/new", (req, res) => {
    res.render("stadiums/new");
});

router.post("/", validateStadium, catchAsync(async (req, res) => {
    const stadium = new Stadium(req.body.stadium);
    await stadium.save();
    req.flash("success", `Succesfully added ${stadium.title}`);
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.get("/edit/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    res.render("stadiums/edit", { stadium });
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id).populate("reviews");
    if(!stadium){
        req.flash("error", "We couldn't find that stadium");
        res.redirect("/stadiums");
    }
    res.render("stadiums/details", { stadium });
}));

router.patch("/:id", validateStadium, catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndUpdate(id, req.body.stadium, { new: true });
    req.flash("success", `Succesfully edited ${stadium.title}`);
    res.redirect(`/stadiums/${stadium._id}`);
}));

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id);
    req.flash("success", `Succesfully deleted ${stadium.title}`);
    res.redirect("/stadiums");
}))

module.exports = router;