const User = require("../models/User");

async function addTwitchUser(twitchUserId) {
  if (await User.findById(twitchUserId)) return;

  const user = new User({
    _id: twitchUserId,
    userPoints: 0,
  });

  await user.save();
  return user;
}

async function getTwitchUser(twitchUserId) {
  return await User.findById(twitchUserId);
}

module.exports = {
  addTwitchUser,
  getTwitchUser,
};
