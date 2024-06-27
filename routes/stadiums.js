const express = require("express");
const router = express.Router();
const Stadium = require("../models/stadium");
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateStadium, isAuthor} = require("../middleware");
const {render_index, render_new, add_stadium, render_edit, show_stadium, update_stadium, delete_stadium} = require("../controllers/stadiums");


router.route("/")
    .get(catchAsync(render_index))
    .post(isLoggedIn, validateStadium, catchAsync(add_stadium));

router.route("/:id")
    .get(catchAsync(show_stadium))
    .patch(isLoggedIn, isAuthor, validateStadium, catchAsync(update_stadium))
    .delete(isLoggedIn, isAuthor, catchAsync(delete_stadium));

router.route("/new")
    .get(isLoggedIn, render_new);

router.route("/edit/:id")
    .get(isLoggedIn, isAuthor, catchAsync(render_edit));

module.exports = router;