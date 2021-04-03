const fs = require("fs/promises");
async function onCheer(channel, userState, twitchClient) {
  const bits = userState.bits;
  await fs.writeFile("bitsState.json", JSON.stringify(bits));
  console.log("cheer:", bits);
}

module.exports = onCheer;
