const { increaseUserPoints, spendUserPoints } = require("./db/actions/points");
const { getTwitchUser } = require("./db/actions/user");
const RotatingMessage = require("./db/models/RotatingMessage");
const User = require("./db/models/User");
const { getStreamInfo } = require("./utils");
// this isn't really a command, but this is the best place to put it for now
async function grantViewerPoints(twitchUserState) {
  try {
    const streamInfo = await getStreamInfo();
    await increaseUserPoints(twitchUserState, streamInfo.chatBasePoints);
  } catch (e) {
    console.log("User points couldn't be granted because", e.message);
  }
}

async function setStreamDescription(description) {
  try {
    const streamInfo = await getStreamInfo();
    streamInfo.streamDescription = description;
    await streamInfo.save();
  } catch (e) {
    console.log(e);
  }
}
async function returnStreamDescription(client, channel) {
  const streamInfo = await getStreamInfo();
  client.say(channel, streamInfo.streamDescription);
}

async function showLeaders(client, channel) {
  const leaders = await User.find({}).sort("-userPoints").limit(5).lean();
  console.log(leaders);
  // const str = `Leaderboard: ${leaders.map((leader) => `${leader.username}: ${leader.userPoints} Points;` )}`;
  const str = `Leaderboard: ${leaders.map(
    (leader, index, arr) =>
      `${leader.username}, ${leader.userPoints} Points${
        index < arr.length - 1 ? "" : ";"
      }`
  )}`;

  client.say(channel, str);
}

// this requires the obs shaderfilter plugin and the ascii effect
async function asciify(obs, twitchUserState, client, channel) {
  try {
    const cost = 1;
    const user = await getTwitchUser(twitchUserState);
    if (user.userPoints > cost) {
      await spendUserPoints(twitchUserState, cost);
      const sourceFilterInfo = await obs.send("GetSourceFilterInfo", {
        sourceName: "Large Webcam",
        filterName: "Asciify",
      });
      return await obs.send("SetSourceFilterVisibility", {
        sourceName: "Large Webcam",
        filterName: "Asciify",
        filterEnabled: !sourceFilterInfo.enabled,
      });
    } else {
      client.say(
        channel,
        `Sorry ${twitchUserState["username"]}, you don't have enough points to use that command.`
      );
    }
  } catch (e) {
    console.log(e);
  }
}

async function muteToggle(obs, twitchUserState, client, channel) {
  try {
    const { muted } = await obs.send("GetMute", { source: "Mic/Aux" });
    await obs.send("SetMute", { source: "Mic/Aux", mute: !muted });
    client.say(
      channel,
      `${twitchUserState["username"]} has ${!muted ? "" : "un"}muted Jedai!`
    );
  } catch (e) {
    console.log(e);
  }
}

async function getRotatingMessages(client, username) {
  try {
    const messages = await RotatingMessage.find({})
      .select("text interval")
      .lean();
    console.log(username);
    await client.whisper(
      username,
      `Messages: ${messages.map(
        (msg) => `${msg.text} | ${msg._id} | ${msg.interval}`
      )}`
    );
    await client.whisper("jedaisaboteur", `Messages`);
  } catch (e) {
    console.log(e);
  }
}
module.exports = {
  grantViewerPoints,
  setStreamDescription,
  returnStreamDescription,
  asciify,
  showLeaders,
  muteToggle,
  getRotatingMessages,
};
