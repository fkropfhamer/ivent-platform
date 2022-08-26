const express = require('express');
const router = express.Router();
const { User } = require('../../data/models')

router.get('/register', async (req, res, next) => {
  const newUser = new User({ username: 'hans' });

  await newUser.save();

  res.json('respond with a resource');
});

router.get('/', async (req, res) => {
  const users = await User.find();

  res.json({ users })
});

module.exports = router;
