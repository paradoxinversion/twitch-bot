// Called every time the bot connects to Twitch chat
function onConnected(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
module.exports = onConnected;
