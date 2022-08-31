const mongoose = require('mongoose');

const User = mongoose.model('User', { username: String, password: String });
const Event = mongoose.model('Event', { title: String, description: String });

module.exports = { User, Event };