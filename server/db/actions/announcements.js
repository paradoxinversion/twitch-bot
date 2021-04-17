const RotatingMessage = require("../models/RotatingMessage");

const addRotatingMessage = async (text, interval) => {
  const newRotatingMessage = new RotatingMessage({
    text,
    interval,
  });

  await newRotatingMessage.save();
  return newRotatingMessage;
};

const deleteRotatingMessage = async (messageId) => {
  try {
    await RotatingMessage.findByIdAndDelete(messageId);
  } catch (e) {
    console.log(e);
  }
};

const getRotatingMessages = async () => {
  return await RotatingMessage.find({}).lean();
};
module.exports = {
  addRotatingMessage,
  deleteRotatingMessage,
  getRotatingMessages,
};
