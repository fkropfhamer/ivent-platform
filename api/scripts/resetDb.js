const mongoose = require('mongoose');

(async function resetDb() {
    console.log("dropping all collections!");

    await mongoose.connect('mongodb://localhost:27017');

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    collections
      .map((collection) => collection.name)
      .forEach(async (collectionName) => {
        console.log(`dropping collection ${collectionName}`);

        db.dropCollection(collectionName);
      });


    console.log("dropped all collections!");

    process.exit(1);
})()
