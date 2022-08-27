const mongoose = require('mongoose');
const { User } = require('./data/models');

(async function loadFixtures() {
    await mongoose.connect('mongodb://localhost:27017');

    await (new User({ username: 'user1', password: '123456' })).save(); 
    await (new User({ username: 'admin', password: 'test123'})).save();

    process.exit(1);
})();