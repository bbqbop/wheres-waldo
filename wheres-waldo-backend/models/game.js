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
    }]
})

module.exports = mongoose.model("Game", gameSchema)