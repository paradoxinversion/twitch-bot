const StreamInfo = require("./db/models/StreamInfo");

async function getStreamInfo() {
  try {
    const streamInfo = await StreamInfo.findOne({});
    if (streamInfo) return streamInfo;

    const newStreamInfo = new StreamInfo({});
    await newStreamInfo.save();
    return newStreamInfo;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getStreamInfo,
};
