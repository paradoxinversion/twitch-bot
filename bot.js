const tmi = require("tmi.js");
const { increaseUserPoints } = require("./db/actions/points");
const startClient = require("./db/client");
require("dotenv").config();
startClient();
// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.on("join", onJoinHandler);
// Connect to Twitch:
client.connect();
const BASE_POINTS = 2;
let streamInfo = "";
function onJoinHandler(channel, username, self) {
  if (self) return;
  console.log(`${username} joined`);
}

// Called every time a message comes in
async function onMessageHandler(channel, userState, msg, self) {
  if (self) return;
  if (!msg.startsWith("!")) {
    try {
      const points = await increaseUserPoints(
        userState["user-id"],
        BASE_POINTS
      );
      console.log(`user has ${points} points`);
    } catch (e) {
      console.log("User points couldn't be granted because", e.message);
    }
  } else {
    const args = msg.slice(1).split(" ");
    const command = args.shift().toLowerCase();
    const isBroadcaster = userState.badges["broadcaster"] === "1";

    // If the command is known, let's execute it
    switch (command) {
      case "info":
        client.say(channel, streamInfo);
        break;
      case "setinfo":
        if (isBroadcaster) {
          streamInfo = args.join(" ");
        }
        break;
      case "explain": {
        switch (args[0]) {
          case "points":
            client.say(
              channel,
              `You gain ${BASE_POINTS} points when you interact in chat. This doesn't apply to commands that start with !, such as !info. Points aren't fully implemented yet.`
            );
            break;

          default:
            break;
        }
      }
      default:
        console.log(`* Unknown command ${command}`);
        break;
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
