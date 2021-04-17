const RotatingMessage = require("../db/models/RotatingMessage");

function rotatingMessages() {
  console.log("Rotating message handler instatiated.");
  const runningIntervals = Object.assign({}, null);
  const isOn = Object.keys(runningIntervals).length > 0;
  async function startMessageRotation(client, channel) {
    const messageRotationArray = await RotatingMessage.find({});

    messageRotationArray.forEach((msg, index) => {
      const messageIntervalId = setInterval(() => {
        client.say(channel, msg.text);
      }, msg.interval);
      runningIntervals[index] = messageIntervalId;
    });
    isOn = true;
  }

  function stopAllMessages() {
    Object.values(runningIntervals).forEach((intervalTimeout) => {
      clearInterval(intervalTimeout);
    });
    isOn = false;
  }
  return {
    startMessageRotation,
    stopAllMessages,
    isOn,
  };
}

module.exports = rotatingMessages;
