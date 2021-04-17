require("dotenv").config();
const startDbClient = require("./db/client");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const announcements = require("./rest/v1/announcements");
const app = express();
const port = 3001;
startDbClient();
const bot = require("./bot.js");
app.set("starlaAnnouncements", bot.starlaAnnouncements);
app.set("starlaMonsterHunt", bot.starlaMonsterHunt);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(bodyParser.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/announcements", announcements);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
