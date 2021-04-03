const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StreamInfo = new Schema({
  streamDescription: { type: String, default: "" },
  chatBasePoints: { type: Number, default: 0 },
});

module.exports = mongoose.model("StreamInfo", StreamInfo);
