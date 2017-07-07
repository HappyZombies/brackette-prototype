const fs = require("fs");
const https = require("https");
const admzip = require("adm-zip");
const Promise = require("promise");
const downloadRelease = require("download-github-release");
/**
 * Begging by brackette.json with that of the brackette.json from GitHub.
*/
//sync get file cuz why not.
let actualVersion;
const bracketteData = JSON.parse(
  fs.readFileSync("./brackette-info.json", "utf8")
);
downloadJson.call().then(decide);

/**
 * Fetches and reads the brackette.json from GitHub.
 */
function downloadJson() {
  const promise = new Promise((resolve, reject) => {
    const request = https.request(bracketteData.jsonPath, res => {
      let data = "";
      res.on("data", d => {
        data = data + d;
      });
      res.on("end", () => {
        try {
          data = JSON.parse(data);
        } catch (e) {
          const err = new Error(e);
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    request.on("error", e => {
      console.error(e);
      reject(e);
    });
    request.end();
  });
  return promise;
}

/**
 * Decides what our course of action should be.
 */
function decide(data) {
  actualVersion = data.version;
  if (actualVersion == bracketteData.version) {
    console.info("You have the latest version: " + data.version);
    return Promise.reject("You have the latest version: " + data.version);
  }
  if (fs.existsSync("../.git")) {
    console.info("You have git, you should 'git pull' not run this updater.");
    return Promise.reject("Please run 'git pull'");
  }
  console.info("You are out of date. Updating now.");
  downloadRelease(
    bracketteData.user,
    bracketteData.repo,
    bracketteData.outputdir,
    filterRelease,
    filterAsset
  )
    .then(function() {
      console.log("All done!");
    })
    .catch(function(err) {
      console.error(err.message);
      // Assuming this worked...
      const zipname = `brackette-${actualVersion}.zip`;
      if (fs.existsSync("../" + zipname)) {
        // it exists so let's go!
        console.log("please wait...");
        const zip = new admzip("../" + zipname);
        zip.extractAllTo("../", true);
        fs.unlink("../" + zipname);
        console.log("done");
      } else {
        console.error(
          "There was an error! Could not find the zip file that we need..."
        );
      }
    });
}

// Define a function to filter releases.
function filterRelease(release) {
  // Filter out prereleases.
  return release.prerelease === true;
}

// Define a function to filter assets.
function filterAsset(asset) {
  // Select assets that contain the string 'windows'.
  return asset.name.indexOf(`brackette-${actualVersion}`) >= 0;
}
