import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  group: { type: String, required: true },
  flagUrl: { type: String, required: true }
});

export default mongoose.model("Team", teamSchema);