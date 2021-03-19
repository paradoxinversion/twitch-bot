const StreamInfo = require("../models/StreamInfo");
const { getTwitchUser, addTwitchUser } = require("./user");

async function setStreamInfoPoints(points) {
  const streamInfo = await StreamInfo.findOne({});
  streamInfo.chatBasePoints = points;
  streamInfo.save();
  return streamInfo.chatBasePoints;
}

async function setUserPoints(twitchUserState, userPoints) {
  let user = await getTwitchUser(twitchUserState);
  if (!user) {
    user = await addTwitchUser(twitchUserState);
  }
  user.userPoints = userPoints;
  await user.save();
  return user.userPoints;
}

async function increaseUserPoints(twitchUserState, increase) {
  let user = await getTwitchUser(twitchUserState);
  if (!user) {
    user = await addTwitchUser(twitchUserState);
  }
  user.userPoints = user.userPoints += increase;
  await user.save();
  return user.userPoints;
}

async function decreaseUserPoints(twitchUserState, decrease) {
  let user = await getTwitchUser(twitchUserState);
  if (!user) {
    user = await addTwitchUser(twitchUserState);
  }
  user.userPoints = user.userPoints -= decrease;
  if (user.userPoints < 0) user.userPoints = 0;
  await user.save();
  return user.userPoints;
}

// This is different from decrease, as it only works if the user has the right amount
async function spendUserPoints(twitchUserState, pointsToSpend) {
  let user = await getTwitchUser(twitchUserState);
  if (!user) {
    user = await addTwitchUser(twitchUserState);
  }
  if (user.userPoints >= pointsToSpend) {
    user.userPoints = user.userPoints -= pointsToSpend;
    await user.save();
    return user.userPoints;
  } else {
    return false;
  }
}

module.exports = {
  setUserPoints,
  increaseUserPoints,
  decreaseUserPoints,
  spendUserPoints,
  setStreamInfoPoints,
};
