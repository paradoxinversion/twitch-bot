const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String },
  userPoints: { type: Number, default: 0 },
  username: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
