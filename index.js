const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Pitch = require("./models/pitch");
const methodOverride = require('method-override');
const path = require("path");

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

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/pitches", async (req, res) => {
    const pitches = await Pitch.find({});
    res.render("pitches/index", { pitches });
});

app.get("/pitches/new", (req, res) => {
    res.render("pitches/new");
});

app.post("/pitches", async (req, res) => {
    const pitch = new Pitch(req.body.pitch);
    await pitch.save();
    res.redirect(`/pitches/${pitch._id}`);
});

app.get("/pitches/edit/:id", async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);
    res.render("pitches/edit", { pitch });
});

app.get("/pitches/:id", async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findById(id);
    res.render("pitches/details", { pitch });
});

app.patch("/pitches/:id", async (req, res) => {
    const { id } = req.params;
    const pitch = await Pitch.findByIdAndUpdate(id, req.body.pitch, { new: true });
    res.redirect(`/pitches/${pitch._id}`);
});

app.delete("/pitches/:id", async (req,res) => {
    const {id} = req.params;
    await Pitch.findByIdAndDelete(id);
    res.redirect("/pitches");
})

app.listen(3000, () => {
    console.log("http://localhost:3000/");
});
