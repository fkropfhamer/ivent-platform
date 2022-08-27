const express = require('express');
const router = express.Router();
const { User } = require('../../data/models')

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body; 

  const newUser = new User({ username, password });

  await newUser.save();

  res.json('respond with a resource');
});

router.get('/', async (req, res) => {
  const users = await User.find();

  res.json({ users })
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  console.log(userId);

  const user = await User.findById(userId).exec();

  console.log(user);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ status: 'user not found'});
  }
});

module.exports = router;
