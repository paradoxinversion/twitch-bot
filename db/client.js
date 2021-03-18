const mongoose = require("mongoose");
const User = require("./models/User");

/**
 * Creates a mongoose database connection
 * @returns The mongoose db connection
 */
const startClient = () => {
  try {
    mongoose.connect("mongodb://localhost/starship-bot", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw error;
  }
};
module.exports = startClient;
