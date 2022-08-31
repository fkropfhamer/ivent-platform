const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', { title: String, description: String });

module.exports = { User, Event };