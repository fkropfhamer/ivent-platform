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

router.get('/profile', auth(), (req, res) => {
    res.json(req.user);
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

function generateAccessToken(user) {
    const { username, _id } = user; 

    return jwt.sign({ username, _id }, secret, { expiresIn: '1800s' });
}

function auth() {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);
        
        try {
            const decoded = jwt.verify(token, secret);
            const user = await User.findById(decoded._id).exec();

            req.user = user;

            next()
        } catch(err) {
            return res.sendStatus(401);
        }
    }
}


module.exports = { router, createUserWithHashedPassword, auth };
