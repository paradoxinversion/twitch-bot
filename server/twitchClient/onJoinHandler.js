function onJoinHandler(channel, username, self) {
  if (self) return;
  console.log(`${username} joined`);
}

module.exports = onJoinHandler;
