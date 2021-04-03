const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  user: { type: String, ref: "User" },
  name: { type: String, default: "Shambling Horror" },
  maxHealth: { type: Number, default: 10 },
  currentHealth: { type: Number, default: 10 },
  deaths: { type: Number, default: 0 },
  type: { type: Number, default: 0 },
});

module.exports = mongoose.model("Character", CharacterSchema);
