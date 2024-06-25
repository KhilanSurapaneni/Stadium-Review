const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const pitchSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

pitchSchema.post("findOneAndDelete", async (doc) => {
    if (doc && doc.reviews && doc.reviews.length > 0) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});


module.exports = mongoose.model("Pitch", pitchSchema);
