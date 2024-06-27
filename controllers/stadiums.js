const Stadium = require("../models/stadium");

const render_index = async (req, res) => {
    const stadiums = await Stadium.find({});
    res.render("stadiums/index", { stadiums });
}

const render_new = (req, res) => {
    res.render("stadiums/new");
}

const add_stadium = async (req, res) => {
    const stadium = new Stadium(req.body.stadium);
    stadium.author = req.user._id;
    stadium.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await stadium.save();
    console.log(stadium);
    req.flash("success", `Succesfully added ${stadium.title}`);
    res.redirect(`/stadiums/${stadium._id}`);
}

const render_edit = async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findById(id);
    res.render("stadiums/edit", { stadium });   
}
const show_stadium = async (req, res) => {
    const { id } = req.params;

    const stadium = await Stadium.findById(id).populate({
        path: "reviews", 
        populate: {
            path: "author"
        }
    }).populate('author');
    if(!stadium){
        req.flash("error", "We couldn't find that stadium");
        res.redirect("/stadiums");
    }
    res.render("stadiums/details", { stadium });
}

const update_stadium = async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndUpdate(id, {...req.body.stadium}, { new: true });
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    stadium.images.push(...images);
    await stadium.save();
    req.flash("success", `Succesfully edited ${stadium.title}`);
    res.redirect(`/stadiums/${stadium._id}`);
}

const delete_stadium = async (req, res) => {
    const { id } = req.params;
    const stadium = await Stadium.findByIdAndDelete(id);
    req.flash("success", `Succesfully deleted ${stadium.title}`);
    res.redirect("/stadiums");
}

module.exports = {render_index, render_new, add_stadium, render_edit, show_stadium, update_stadium, delete_stadium}