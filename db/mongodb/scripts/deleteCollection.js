/**
 * Script to delete a MongoDB collection.
 * - If no collection name is provided, lists all collections.
 * - If a collection name is provided, deletes that collection.
 * Usage:
 *   node deleteCollection.js           -> lists all collections
 *   node deleteCollection.js <name>    -> deletes the named collection
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
    const db = await client.db(); // Use default database from connection string

    if (!collectionName) {
      // No argument: list all collections
      console.log("No collection specified. Listing all collections:\n");
      const collections = await db.listCollections().toArray();
      if (collections.length === 0) {
        console.log("No collections found in this database.");
      } else {
        collections.forEach((col) => console.log("- " + col.name));
      }
      console.log("\nTo delete a collection, run: node deleteCollection.js <collectionName>");
      return;
    }

    // Check if collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      console.log(`Collection "${collectionName}" does not exist.`);
      return;
    }

    // Drop the collection
    await db.collection(collectionName).drop();
    console.log(`Collection "${collectionName}" has been deleted successfully.`);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
