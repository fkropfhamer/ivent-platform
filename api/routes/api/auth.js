const jwt = require("jsonwebtoken");
const express = require("express");
const argon2 = require('argon2');
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

    if (await isPasswordCorrect(user, password)) {
        return res.json({ jwt: generateAccessToken(user)});
    }

    res.status(401).json({ status: "bad username or password"})
});


async function isPasswordCorrect(user, password) {
    return argon2.verify(user.password, password);
}

async function hashPassword(password) {
    return argon2.hash(password);
}

async function createUserWithHashedPassword(username, password) {
    const passwordHash = await hashPassword(password);

    return new User({ username, password: passwordHash });
}

function generateAccessToken(username) {
    return jwt.sign({ username }, secret, { expiresIn: '1800s' });
}


module.exports = { router, createUserWithHashedPassword };
