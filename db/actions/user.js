const User = require("../models/User");

// async function addTwitchUser(twitchUserId) {
//   if (await User.findById(twitchUserId)) return;

//   const user = new User({
//     _id: twitchUserId,
//     userPoints: 0,
//   });

//   await user.save();
//   return user;
// }
async function addTwitchUser(twitchUserState) {
  const twitchUserId = twitchUserState["user-id"];
  const twitchUsername = twitchUserState["username"];
  if (await User.findById(twitchUserId)) return;

  const user = new User({
    _id: twitchUserId,
    userPoints: 0,
    username: twitchUsername,
  });

  await user.save();
  return user;
}
async function getTwitchUser(twitchUserState) {
  return await User.findById(twitchUserState["user-id"]);
}

module.exports = {
  addTwitchUser,
  getTwitchUser,
};
