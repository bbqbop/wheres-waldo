const asyncHandler = require('express-async-handler')
const cloudinary = require('../utils/cloudinary');

const Game = require('../models/game');

exports.readAll = asyncHandler(async (req, res) => {
    const games = await Game.find()
    res.json({ message: "All games found!", games})
})

exports.create = asyncHandler(async (req, res) => {
    
    const imgResult = await cloudinary.uploadStream(req.file.buffer)
    if (!imgResult) throw new Error("Error uploading image.")
    const { title } = req.body
    const image = {
        url: imgResult.url,
        public_id: imgResult.public_id 
    }
    const game = new Game({
        title, 
        image
    })
    const result = await game.save()
    console.log(result)
    res.json({ message: "Upload successful", game })
})

exports.update = asyncHandler(async (req, res) => {
    const gameId = req.params.id
    const characters = req.body
    const game = await Game.findById(gameId);

    if (!game) {
        throw new Error("Game not found")
    }

    game.characters.push(...characters);

    game.save()
    res.json({message: "Upload successful!", game})
})