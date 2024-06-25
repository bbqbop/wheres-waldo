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
            username: user.username,
            _id: user._id
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
            _id: user._id,
            isAdmin: user.isAdmin
        }
    })
})

exports.read = asyncHandler(async (req, res) => {
    if(req.user._id != req.params.id){
        return res.status(401).json({ error: "Authentication failed. Accessing wrong user information" })
    };
    const user = await User.findById(req.user._id);

    res.json({ message: 'User information fetched.', user })
})

exports.update = asyncHandler(async (req, res) => {
    if(req.user._id != req.params.id){
        return res.status(401).json({ error: "Authentication failed. Accessing wrong user information" })
    };

    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })

    res.json({ message: 'User information updated successfully', user})
})

exports.updatePassword = asyncHandler(async (req, res) => {
    if(req.user._id != req.params.id){
        return res.status(401).json({ error: "Authentication failed. Accessing wrong user information" })
    };

    const user = await User.findById(req.user._id)

    const match = await verifyPassword(req.body.oldPassword, user.password)
    if (!match) {
        return res.status(401).json({ error: "Authentication failed. Password incorrect."})
    }

    user.password = await generatePassword(req.body.newPassword)

    const result = await user.save()
    
    res.json({
        message: "Password updated successfully.",
        user
    })
})