const express = require('express');
const router = express.Router();
const { User } = require('../../data/models');
const { hashPassword, createUserWithHashedPassword } = require('./auth');

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body; 

  if (!username) {
    return res.status(400).json({status: "no username provided"});
  }

  if (!password) {
    return res.status(400).json({status: "no password provided"});
  }

  const newUser = await createUserWithHashedPassword(username, password);

  try {
    await newUser.save();  
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ status: "username already in use"});
    }

    return res.status(400).json({ error: "error"});
  }
  

  res.json({ status: 'user created'});
});

router.get('/', async (req, res) => {
  const users = await User.find();

  res.json(users)
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

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  await User.deleteOne({ _id: userId});

  res.json({ success: true });
});

module.exports = router;
