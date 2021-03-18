const { getTwitchUser, addTwitchUser } = require("./user");

async function setUserPoints(twitchUserId, userPoints) {
  let user = await getTwitchUser(twitchUserId);
  if (!user) {
    user = await addTwitchUser(twitchUserId);
  }
  user.userPoints = userPoints;
  await user.save();
  return user.userPoints;
}

async function increaseUserPoints(twitchUserId, increase) {
  let user = await getTwitchUser(twitchUserId);
  if (!user) {
    user = await addTwitchUser(twitchUserId);
  }
  user.userPoints = user.userPoints += increase;
  await user.save();
  return user.userPoints;
}

async function decreaseUserPoints(twitchUserId, decrease) {
  let user = await getTwitchUser(twitchUserId);
  if (!user) {
    user = await addTwitchUser(twitchUserId);
  }
  user.userPoints = user.userPoints -= decrease;
  if (user.userPoints < 0) user.userPoints = 0;
  await user.save();
  return user.userPoints;
}

// This is different from decrease, as it only works if the user has the right amount
async function spendUserPoints(twitchUserId, pointsToSpend) {
  let user = await getTwitchUser(twitchUserId);
  if (!user) {
    user = await addTwitchUser(twitchUserId);
  }
  if (user.userPonts >= pointsToSpend) {
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
};
