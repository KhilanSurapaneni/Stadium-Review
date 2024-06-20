// Mongoose setup
const mongoose = require("mongoose");
const Pitch = require("../models/pitch")
mongoose.connect('mongodb://localhost:27017/pitch-review')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!") // Logs a message when the connection is successfully opened.
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!") // Logs an error message if the connection fails.
        console.log(err) // Logs the error details.
    });

const cities = require("./cities");
const pitches = require("./seedHelpers")

const seedDB = async () => {
    await Pitch.deleteMany({});
    for (let i = 0; i < pitches.length; i++){
        const randNum = Math.floor(Math.random() * cities.length);
        const p = new Pitch({
            title: pitches[i],
            location: `${cities[randNum].city}, ${cities[randNum].state}`
        })
        await p.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});