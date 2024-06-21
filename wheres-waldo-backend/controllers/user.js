const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

const { generatePassword, verifyPassword } = require("../utils/passwordUtils")

const User = require('../models/user');

exports.signUp = asyncHandler(async(req, res) => {
    const { username, password, firstname, lastname } = req.body
    const userExists = await User.findOne({ username })
    if (userExists) {
        return res.status(409).json({ error: "Username already exists!" })
    }
    const hash = await generatePassword(password)
    const isAdmin = username == 'bbqbop' ? true : false;
    const newUser = new User ({
        username, 
        password: hash,
        firstname, 
        lastname, 
        isAdmin
    })

    const user = await newUser.save()
    console.log(`User signed up, ${user}`)
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
        message: 'Successfully signed up!',
        token, 
        user: {
            firstname: user.firstname, 
            lastname: user.lastname,
            username: user.username
        }
    })
})

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ error: "Authentication failed. User not found." })
    }
    const match = await verifyPassword( password, user.password )
    if (!match) {
        return res.status(401).json({ error: "Authentication failed. Password incorrect."})
    }
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    console.log(`User logged in, ${user}`)
    res.json({
        message: "Authentication Successful",
        token, 
        user: {
            firstname: user.firstname, 
            lastname: user.lastname,
            username: user.username,
            id: user._id,
            isAdmin: user.isAdmin
        }
    })
})