// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Team from "../models/team.js";
import { teams } from "../data/teams.js";
import database from "../database.js";

// dotenv.config();

async function addTeams() {
  try {
    // Remove all old teams
    await database.deleteCollection("teams");
    console.log("Old teams deleted");

    // Insert new teams
    await database.addMany("teams", teams);
    console.log("New teams inserted");

    process.exit();
  } catch (err) {
    console.error("Failed to add teams. ", err);
    process.exit(1);
  }
}

addTeams();
