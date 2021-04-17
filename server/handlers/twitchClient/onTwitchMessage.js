const {
  grantViewerPoints,
  returnStreamDescription,
  setStreamDescription,
  asciify,
  showLeaders,
  muteToggle,
  getRotatingMessages,
  firstdraft,
  getUserPoints,
} = require("../../commands");
const {
  addRotatingMessage,
  deleteRotatingMessage,
} = require("../../db/actions/announcements");
const {
  getCharacter,
  decreaseHealth,
  createCharacter,
  decreaseMonsterHealth,
} = require("../../db/actions/characters");
const { setStreamInfoPoints } = require("../../db/actions/points");

async function onTwitchMessage(
  channel,
  userState,
  msg,
  self,
  obs,
  twitchClient,
  rmh,
  mh
) {
  if (self) return;
  if (!msg.startsWith("!")) {
    // obs
    //   .send("GetSceneList")
    //   .then((sceneListData) => {
    //     const newSceneName =
    //       sceneListData.scenes[
    //         Math.floor(Math.random() * sceneListData.scenes.length)
    //       ].name;

    //     return obs.send("SetCurrentScene", {
    //       "scene-name": newSceneName,
    //     });
    //   })
    //   .catch((e) => console.log(e));

    await grantViewerPoints(userState);
  } else {
    const args = msg.slice(1).split(" ");
    const command = args.shift().toLowerCase();
    const isBroadcaster = userState.badges["broadcaster"] === "1";
    // If the command is known, let's execute it
    switch (command) {
      case "info": {
        await returnStreamDescription(twitchClient, channel);
        break;
      }

      case "firstdraft": {
        await firstdraft(twitchClient, channel);
        break;
      }
      case "set-description": {
        if (isBroadcaster) {
          const streamInfo = args.join(" ");
          await setStreamDescription(streamInfo);
        }
        break;
      }

      case "set-points": {
        if (isBroadcaster) {
          const newPoints = await setStreamInfoPoints(args[0]);
          twitchClient.say(
            channel,
            `Each chat message is now worth ${newPoints} point${
              newPoints > 1 ? "s" : ""
            }!`
          );
        }
        break;
      }
      case "my-points": {
        await getUserPoints(twitchClient, channel, userState["user-id"]);
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
          rmh.startMessageRotation(twitchClient, channel);
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
          await getRotatingMessages(twitchClient, userState.username);
        }
        break;
      }
      case "delete-rotating-message": {
        if (isBroadcaster) {
          await deleteRotatingMessage(args[0]);
        }
        break;
      }
      case "leaderboard": {
        await showLeaders(twitchClient, channel);
        break;
      }
      case "list-commands": {
        twitchClient.say(
          channel,
          "!help, !info, !control, !list-commands, !leaderboard"
        );
        break;
      }
      case "monster-hunt": {
        switch (args[0]) {
          case "register": {
            const existingCharacter = await getCharacter(userState["user-id"]);
            if (existingCharacter) {
              twitchClient.say(
                channel,
                `${userState["display-name"]}, you are already registered to hunt monsters.`
              );
              break;
            }

            const character = await createCharacter(userState);
            twitchClient.say(
              channel,
              `${userState["display-name"]}, you have been registered as a hunter. Use [!monster-hunt bounty] to see the current bounty!`
            );
            break;
          }
          // case "resurrect": // requires chat points
          case "bounty": {
            if (!(await getCharacter(userState["user-id"]))) {
              twitchClient.say(
                channel,
                `${userState["display-name"]}, you aren't a registered hunter, yet. Use [!monster-hunt register] to get started.`
              );
              break;
            }
            const monster = await mh.getCurrentMonster();
            twitchClient.say(
              channel,
              `The current monster is ${monster.name}! (${monster.currentHealth}/${monster.maxHealth} HP)`
            );
            break;
          }
          case "attack": {
            if (!(await getCharacter(userState["user-id"]))) {
              twitchClient.say(
                channel,
                `${userState["display-name"]}, you aren't even a registered hunter. You could get seriously injured, you know. Use [!monster-hunt register] if you don't care about that.`
              );
              break;
            }
            const monster = await mh.getCurrentMonster();
            const character = await getCharacter(userState["user-id"]);
            // do battle
            let monsterDamage =
              Math.floor(Math.random() * 5) - Math.floor(Math.random() * 5);
            if (monsterDamage < 0) monsterDamage = 0;
            let characterDamage =
              Math.floor(Math.random() * 5) - Math.floor(Math.random() * 5);
            if (characterDamage < 0) characterDamage = 0;

            const characterHealth = await decreaseHealth(
              userState["user-id"],
              monsterDamage
            );
            const monsterHealth = await decreaseMonsterHealth(
              monster._id,
              characterDamage
            );
            const baseString = `${monster.name} took ${characterDamage} damage! ${character.name} took ${monsterDamage} damage!`;
            let monsterDeathStr = "";
            let characterDeathStr = "";
            if (monsterHealth === 0) {
              monsterDeathStr = `${monster.name} has been slain by ${character.name}!`;
            }
            if (characterHealth === 0) {
              characterDeathStr = `${character.name} has been slain by ${monster.name}!`;
            }
            twitchClient.say(
              channel,
              `${baseString} ${monsterDeathStr} ${characterDeathStr}`
            );

            break;
          }
          default:
            break;
        }
      }
      case "control": {
        switch (args[0]) {
          case "cam": {
            switch (args[1]) {
              case "asciify": {
                await asciify(obs, userState, twitchClient, channel);
                break;
              }

              default:
                break;
            }
            break;
          }

          case "mute": {
            await muteToggle(obs, userState, twitchClient, channel);
            break;
          }
          default:
            break;
        }
        break;
      }
      case "help": {
        if (args.length === 0) {
          twitchClient.say(
            channel,
            "To see a list of commands, type '!list-commands'."
          );
          break;
        } else {
          switch (args[0]) {
            case "points": {
              twitchClient.say(
                channel,
                `You gain ${BASE_POINTS} points when you interact in chat. This doesn't apply to commands that start with !, such as !info. Points aren't fully implemented yet.`
              );
              break;
            }
            case "control": {
              if (args.length === 1) {
                twitchClient.say(
                  channel,
                  "Control allows you to control the streamer's webcam and scenes in OBS! Control commands are: asciify"
                );
              } else {
                switch (args[1]) {
                  case "asciify":
                    twitchClient.say(
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

module.exports = onTwitchMessage;
