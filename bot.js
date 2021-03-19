const tmi = require("tmi.js");
const OBSWebSocket = require("obs-websocket-js");
const {
  grantViewerPoints,
  returnStreamDescription,
  setStreamDescription,
  asciify,
  showLeaders,
  muteToggle,
  getRotatingMessages,
} = require("./commands");
const {
  increaseUserPoints,
  setStreamInfoPoints,
} = require("./db/actions/points");
const startClient = require("./db/client");
const { addRotatingMessage } = require("./db/actions/announcements");
const RotatingMessage = require("./db/models/RotatingMessage");
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

const tempRepeatingMessages = [
  { text: "Message 1", interval: 500 },
  { text: "Message 2", interval: 3500 },
];

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

const obs = new OBSWebSocket();
obs
  .connect()
  .then(() => {
    console.log("Connected to OBS!");
  })
  .catch((err) => console.log(err));

function rotatingMessageHandler() {
  const runningIntervals = Object.assign({}, null);

  async function startMessageRotation(client, channel) {
    const messageRotationArray = await RotatingMessage.find({});

    messageRotationArray.forEach((msg, index) => {
      const messageIntervalId = setInterval(() => {
        client.say(channel, msg.text);
      }, msg.interval);
      runningIntervals[index] = messageIntervalId;
    });
  }

  function stopAllMessages() {
    Object.values(runningIntervals).forEach((intervalTimeout) => {
      clearInterval(intervalTimeout);
    });
  }
  return {
    startMessageRotation,
    stopAllMessages,
  };
}
const rmh = rotatingMessageHandler();
// rmh.startMessageRotation();
async function onMessageHandler(channel, userState, msg, self) {
  if (self) return;
  if (!msg.startsWith("!")) {
    obs
      .send("GetSceneList")
      .then((sceneListData) => {
        const newSceneName =
          sceneListData.scenes[
            Math.floor(Math.random() * sceneListData.scenes.length)
          ].name;

        return obs.send("SetCurrentScene", {
          "scene-name": newSceneName,
        });
      })
      .catch((e) => console.log(e));

    await grantViewerPoints(userState);
  } else {
    const args = msg.slice(1).split(" ");
    const command = args.shift().toLowerCase();
    const isBroadcaster = userState.badges["broadcaster"] === "1";
    // If the command is known, let's execute it
    switch (command) {
      case "info": {
        await returnStreamDescription(client, channel);

        break;
      }
      case "set-description": {
        if (isBroadcaster) {
          streamInfo = args.join(" ");
          await setStreamDescription(streamInfo);
        }
        break;
      }
      case "set-points": {
        if (isBroadcaster) {
          const newPoints = await setStreamInfoPoints(args[0]);
          client.say(
            channel,
            `Each chat message is now worth ${newPoints} point${
              newPoints > 1 ? "s" : ""
            }!`
          );
        }
        break;
      }
      case "add-rotating-message": {
        if (isBroadcaster) {
          // the last argument is the interval
          const message = args.slice(0, args.length - 1).join(" ");
          const interval = args[args.length - 1];
          console.log(message, args[args.length - 1]);
          await addRotatingMessage(message, interval);
        }
        break;
      }
      case "start-message-rotation": {
        if (isBroadcaster) {
          rmh.startMessageRotation(client, channel);
        }
        break;
      }
      case "stop-message-rotation": {
        if (isBroadcaster) {
          rmh.stopAllMessages();
        }
        break;
      }
      case "get-rotating-messages": {
        if (isBroadcaster) {
          await getRotatingMessages(client, channel);
        }
        break;
      }
      case "leaderboard": {
        await showLeaders(client, channel);
        break;
      }
      case "list-commands": {
        client.say(
          channel,
          "!help, !info, !control, !list-commands, !leaderboard"
        );
        break;
      }
      case "control": {
        switch (args[0]) {
          case "cam": {
            switch (args[1]) {
              case "asciify": {
                await asciify(obs, userState, client, channel);
                break;
              }

              default:
                break;
            }
            break;
          }

          case "mute": {
            await muteToggle(obs, userState, client, channel);
            break;
          }
          default:
            break;
        }
        break;
      }
      case "help": {
        if (args.length === 0) {
          client.say(
            channel,
            "To see a list of commands, type '!list-commands'."
          );
          break;
        } else {
          switch (args[0]) {
            case "points": {
              client.say(
                channel,
                `You gain ${BASE_POINTS} points when you interact in chat. This doesn't apply to commands that start with !, such as !info. Points aren't fully implemented yet.`
              );
              break;
            }
            case "control": {
              if (args.length === 1) {
                client.say(
                  channel,
                  "Control allows you to control the streamer's webcam and scenes in OBS! Control commands are: asciify"
                );
              } else {
                switch (args[1]) {
                  case "asciify":
                    client.say(
                      channel,
                      "This allows you to turn the streamer's webcam into ascii!"
                    );
                    break;

                  default:
                    break;
                }
              }
            }
            default:
              break;
          }
        }
      }

      default: {
        console.log(`* Unknown command ${command}`);
        break;
      }
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
