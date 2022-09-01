const mongoose = require('mongoose');
const { User, Event } = require('../data/models');
const { createUserWithHashedPassword } = require('../routes/api/auth');

(async function loadFixtures() {
    await mongoose.connect('mongodb://localhost:27017');

    await loadUserFixtures();
    await loadEventFixtures();

    process.exit(1);
})();


async function loadUserFixtures() {
    await (await createUserWithHashedPassword('user1', '123456')).save(); 
    await (await createUserWithHashedPassword('admin', 'test123')).save();
}

async function loadEventFixtures() {
    await (new Event({ title: "An Event", description: "An awesome Event!"})).save();
}