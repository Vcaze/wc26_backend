/**
 * Script to show MongoDB collection contents.
 * - Lists all collections if no argument is given
 * - Prints documents if a collection name is provided
 */
"use strict";

require('dotenv').config();
const mongo = require("mongodb").MongoClient;

// Build DSN from environment variables
const dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@wc26.v0ttzgp.mongodb.net/?appName=wc26`;

// Get collection name from command-line arguments
const collectionName = process.argv[2];

async function run() {
  const client = await mongo.connect(dsn, { useUnifiedTopology: true });

  try {
    const db = await client.db(); // <-- no database name specified

    if (!collectionName) {
      // List all collections
      console.log("No collection specified. Listing all collections:\n");
      const collections = await db.listCollections().toArray();
      if (collections.length === 0) {
        console.log("No collections found in this database.");
      } else {
        collections.forEach((col) => console.log("- " + col.name));
      }
      console.log("\nTo see documents, run: node showCollection.js <collectionName>");
      return;
    }

    // Get the requested collection
    const col = await db.collection(collectionName);
    const documents = await col.find({}).toArray();

    if (documents.length === 0) {
      console.log(`Collection "${collectionName}" is empty.`);
    } else {
      console.log(`Documents in "${collectionName}":`);
      console.dir(documents, { depth: null, colors: true });
    }

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
