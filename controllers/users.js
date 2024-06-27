const User = require("../models/user");  // Importing User model

const render_register_form = (req, res) => {
    res.render("users/register");  // Render register view
}

const regiser_user = async (req, res) => {
    try {
        const { email, username, password } = req.body;  // Extracting email, username, and password from request body
        const user = new User({ email, username });  // Creating a new User instance
        const registeredUser = await User.register(user, password);  // Registering the user
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            else {
                req.flash("success", "Succesfully Created an Account!");  // Flashing success message
                res.redirect("/stadiums");  // Redirecting to stadiums page
            }
        })
    } catch (e) {
        req.flash("error", e.message);  // Flashing error message
        res.redirect("/register");  // Redirecting back to registration page
    }

}

const render_login = (req, res) => {
    res.render("users/login");  // Render login view
}

const login = (req, res) => {
    req.flash("success", "Succesfully Logged In!");  // Flashing success message
    res.redirect("/stadiums");  // Redirecting to stadiums page after successful login
}

const logout = (req,res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully Logged Out!');
        res.redirect('/stadiums');
    });
}

module.exports = {render_register_form, regiser_user, render_login, login, logout};