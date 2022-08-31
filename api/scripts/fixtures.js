const mongoose = require('mongoose');
const { User, Event } = require('../data/models');

(async function loadFixtures() {
    await mongoose.connect('mongodb://localhost:27017');

    await loadUserFixtures();
    await loadEventFixtures();

    process.exit(1);
})();


async function loadUserFixtures() {
    await (new User({ username: 'user1', password: '123456' })).save(); 
    await (new User({ username: 'admin', password: 'test123'})).save();
}

async function loadEventFixtures() {
    await (new Event({ title: "An Event", description: "An awesome Event!"})).save();
}