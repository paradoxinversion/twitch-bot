var express = require("express");
const {
  getRotatingMessages,
  deleteRotatingMessage,
  addRotatingMessage,
} = require("../../db/actions/announcements");
var router = express.Router();

router.get("/", async function (req, res) {
  const currentAnnouncements = await getRotatingMessages();
  res.json({ announcements: currentAnnouncements });
});

router.post("/", async function (req, res) {
  console.log("post");
  console.log(req.body);
  const { text, interval } = req.body;
  const newMessage = await addRotatingMessage(text, interval);
  res.json({ success: 1 });
});

router.delete("/", async function (req, res) {
  const { announcementId } = req.query;
  const deletion = await deleteRotatingMessage(announcementId);
  res.json({ success: 1 });
});
module.exports = router;
