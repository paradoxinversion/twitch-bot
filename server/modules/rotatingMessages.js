const RotatingMessage = require("../db/models/RotatingMessage");

function rotatingMessages() {
  console.log("Rotating message handler instatiated.");
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

module.exports = rotatingMessages;
