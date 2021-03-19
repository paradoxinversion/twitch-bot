const RotatingMessage = require("../models/RotatingMessage");

const addRotatingMessage = (text, interval) => {
  const newRotatingMessage = new RotatingMessage({
    text,
    interval,
  });

  newRotatingMessage.save();
  return newRotatingMessage;
};

module.exports = {
  addRotatingMessage,
};
