const mongoose = require('mongoose');

const Cat = mongoose.model('Cat', { name: String });
const User = mongoose.model('User', { username: String });

module.exports = { Cat, User }