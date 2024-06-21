require("dotenv").config();
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}

passport.use(new JwtStrategy(options, async(jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.sub);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

const authJwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next);
};

const authAdmin = async (req, res, next) => {
    console.log('here', req.user)
    if (!req.user || !req.user.isAdmin) return res.status(401).json({ error: "Unauthorized: User does not have admin status."})
    next();
};

module.exports = { passport, authJwt, authAdmin }