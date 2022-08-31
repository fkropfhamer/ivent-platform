const jwt = require("jsonwebtoken");
const express = require("express");
const { User } = require("../../data/models");
const router = express.Router();

const secret = 'secret';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ status: "bad username or password"})
    }

    const user = await User.findOne({ username }).exec();

    if (!user) {
        return res.status(401).json({ status: "bad username or password"})
    }

    if (isPasswordCorrect(user, password)) {
        return res.json({ jwt: generateAccessToken(user)});
    }

    res.status(401).json({ status: "bad username or password"})
});


function isPasswordCorrect(user, password) {
    return user.password === password;
}


function generateAccessToken(username) {
    return jwt.sign({ username }, secret, { expiresIn: '1800s' });
}


module.exports = { router };
