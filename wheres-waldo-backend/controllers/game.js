const asyncHandler = require('express-async-handler')
const cloudinary = require('../utils/cloudinary');

const Game = require('../models/game');
const User = require("../models/user");

async function deleteEntry(game){
    if (game.image && game.image.public_id) await cloudinary.deleteImg(game.image.public_id)
    const success = await Game.deleteOne(game._id)
    if (!success){
        throw new Error("Error deleting entry from database.")
    }
}

exports.readAll = asyncHandler(async (req, res) => {
    let games = await Game.find().populate({
        path: "author",
        select: 'username'
    })
    // clean up incomplete games
    let needUpdate = false
    await Promise.all(games.map(async (game) => {
        if (!game.characters.length >= 1) {
            await deleteEntry(game);
            needUpdate = true
        }
    }));

    if (needUpdate) {
        games = await Game.find().populate({
            path: "author",
            select: 'username'
            })
    }

    res.json({ message: "All games found!", games})
})

exports.create = asyncHandler(async (req, res) => {
    const imgResult = await cloudinary.uploadStream(req.file.buffer)
    if (!imgResult) throw new Error("Error uploading image.")

    const { title } = req.body
    const image = {
        original: {
            url: imgResult.original.url,
            public_id: imgResult.original.public_id 
        },
        preview: {
            url: imgResult.preview.url,
            public_id: imgResult.preview.public_id
        }
    }

    const game = new Game({
        title, 
        author: req.user._id,
        image
    })
    const result = await game.save()
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

    const result = await game.save()
    console.log(result)
    res.json({message: "Upload successful!", game})
})

exports.read = asyncHandler(async (req, res) => {
    const gameId = req.params.id
    const game = await Game.findById(gameId).populate({
        path: 'author',
        select: 'username'
    })

    if (!game) {
        throw new Error("Game not found")
    }

    res.json({ message: "Game found!", game })
})

exports.updateScores = asyncHandler(async (req, res) => {
    const gameId = req.params.id
    let { username, score } = req.body

    if (!username) {
        username = 'guest'
    }

    let user = await User.findOne({ username })

    const game = await Game.findById(gameId);

    if (!game) {
        return res.status(401).json({ error: "Game not found."})
    }

    game.scores.push({ username, user_id: user ? user._id : null, score })

    await game.save();

    res.status(200).json({ message: "Scores updated successfully", game})
})

exports.delete = asyncHandler(async (req, res) => {

    const game = await Game.findById(req.params.id)
    if (!game){
        return res.status(401).json({ error: "Game not found."})
    }
    await deleteEntry(game)
    res.json({
        message: "Entry deleted successfully",
        game
    })
})