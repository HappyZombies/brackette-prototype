const setup = require("express").Router();
const fs = require("fs");
const configPath = process.cwd() + "/config.json";
const config = JSON.parse(fs.readFileSync(configPath));
const challonge = require("challonge");

setup.post("/", (req, res) => {
  const apikey = req.body.apikey;
  // const password = req.body.password // TODO: Add password field
  const client = challonge.createClient({
    apiKey: apikey
  });
  client.tournaments.index({
    callback: err => {
      if (err) {
        console.error("Error on setup!");
        return res.status(406).json({ error: err.text });
      }
      config.setup = true;
      config.apikey = apikey;
      config.password = "password";
      fs.writeFileSync(configPath, JSON.stringify(config), "utf8");
      return res.status(200).json({ setup: true });
    }
  });
});

setup.post("/reset", (req, res) => {
  const password = req.body.password;
  if (password !== config.password) {
    return res.json({ success: false });
  }
  config.setup = false;
  config.apikey = "";
  config.password = "";
  fs.writeFileSync(configPath, JSON.stringify(config), "utf8");
  return res.json({ success: true });
});

setup.get("/setup-status", (req, res) => {
  return res.status(200).json({ setup: config.setup });
});

module.exports = setup;
