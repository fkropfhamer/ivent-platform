const mongoose = require('mongoose');

(async function resetDb() {
    console.log("dropping all collections!");

    await mongoose.connect('mongodb://localhost:27017');

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      console.log(`dropping collection ${collection.name}`);

      await db.dropCollection(collection.name);
    }

    console.log("dropped all collections!");

    process.exit(1);
})()
