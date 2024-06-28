// Mongoose setup
const mongoose = require("mongoose");
const Stadium = require("../models/stadium")
const axios = require("axios");
mongoose.connect('mongodb://localhost:27017/stadium-review')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!") // Logs a message when the connection is successfully opened.
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!") // Logs an error message if the connection fails.
        console.log(err) // Logs the error details.
    });

const stadiums = require("./seedHelpers");

// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
            client_id: 'RxRnvwTQZmsFMqpR1v2nDuQyYxG3aOyqwltGA711ITg',
            collections: 97680579,
        },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}
  

const seedDB = async () => {
    await Stadium.deleteMany({});
    for (let i = 0; i < 20; i++){
        const randNum = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 100000) + 100000;
        const p = new Stadium({
            author: "667c9b4cd69bb039bb9b09ee",
            title: stadiums[i],
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/de9u6w1i2/image/upload/v1719508455/StadiumReview/wdztrfqv9mftfelwgy4g.jpg',
                  filename: 'StadiumReview/wdztrfqv9mftfelwgy4g'
                },
                {
                  url: 'https://res.cloudinary.com/de9u6w1i2/image/upload/v1719508455/StadiumReview/fv2jyqrwzdqltczxygpy.jpg',
                  filename: 'StadiumReview/fv2jyqrwzdqltczxygpy'
                }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            price
        })
        await p.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});