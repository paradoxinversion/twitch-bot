const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RotatingMessage = new Schema({
  text: { type: String, required: true },
  interval: { type: Number, required: true },
});

module.exports = mongoose.model("RotatingMessage", RotatingMessage);
