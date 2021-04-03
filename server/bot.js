require("dotenv").config();
const tmi = require("tmi.js");
const OBSWebSocket = require("obs-websocket-js");

const startClient = require("./db/client");
const onJoinHandler = require("./handlers/twitchClient/onJoinHandler");
const onTwitchMessage = require("./handlers/twitchClient/onTwitchMessage");
const onConnected = require("./handlers/twitchClient/onConnected");

const rotatingMessages = require("./modules/rotatingMessages");
const onCheer = require("./handlers/twitchClient/onCheer");
const monsterHunt = require("./modules/monsterHunt");

startClient();

// Define configuration options
const twitchClientOpts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};
// Create a client with our options
const obs = new OBSWebSocket();
obs
  .connect()
  .then(() => {
    console.log("Connected to OBS!");
  })
  .catch((err) => console.log(err));
const rms = rotatingMessages();
const mh = monsterHunt();
const twitchClient = new tmi.client(twitchClientOpts);
twitchClient.on("message", (channel, userState, msg, self) => {
  onTwitchMessage(channel, userState, msg, self, obs, twitchClient, rms, mh);
});
twitchClient.on("connected", onConnected);
twitchClient.on("join", onJoinHandler);
twitchClient.on("cheer", onCheer);
twitchClient.connect();
