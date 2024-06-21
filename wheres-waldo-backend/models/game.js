const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {type: String, required: true },
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    characters: [{
        name: {type: String},
        coords: {
            type: [Number]
        }
    }],
    author: {type: mongoose.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    scores: [{
        username: { type: String, required: true },
        user_id: { type: mongoose.Types.ObjectId, ref: "User" },
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model("Game", gameSchema)