const express = require("express");  // Importing Express framework
const router = express.Router();     // Creating an Express router
const User = require("../models/user");  // Importing User model
const catchAsync = require('../utils/catchAsync');  // Importing catchAsync utility function
const passport = require("passport");  // Importing Passport.js for authentication
const { render_register_form, regiser_user, render_login, login, logout } = require("../controllers/users");


router.route("/register")
    .get(render_register_form)
    .post(catchAsync(regiser_user));

router.route("/login")
    .get(render_login)
    // passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" })
    // Middleware that uses Passport.js to authenticate the user locally (using username and password).
    // This route handles the submission of the login form, authenticates the user, and redirects accordingly.
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), login);

router.route("/logout")
    .get(logout);

module.exports = router;  // Exporting the router
