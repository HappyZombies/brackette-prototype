const fs = require('fs')
const https = require('https')
const admzip = require('adm-zip')
const Promise = require('promise')
const bracketteData = require('../brackette-info.json')
const downloadRelease = require('download-github-release');
/**
 * Begging by brackette.json with that of the brackette.json from GitHub.
*/
downloadJson.call()
.then(decide)

/**
 * Fetches and reads the brackette.json from GitHub.
 */
function downloadJson() {
  const promise = new Promise((resolve, reject) => {
    const request = https.request(bracketteData.jsonPath, (res) => {
      let data = ''
      res.on('data', (d) => {
        data = data + d
      })
      res.on('end', () => {
        try {
          data = JSON.parse(data)
        } catch (e) {
          const err = new Error(e);
          reject(err)
          return;
        }
        resolve(data)
      })
    })
    request.on('error', (e) => {
      reject(e)
    })
    request.end()
  })
  return promise
}

/**
 * Decides what our course of action should be.
 */
function decide(data) {
  console.dir(data)
  const actualVersion = data.version;
  if(actualVersion == bracketteData.version) {
    console.info("You have the latest version: " + data.version);
    return Promise.reject("You have the latest version: " + data.version);
  }
  console.info("You are out of date. Updating now.");
  downloadRelease(bracketteData.user, bracketteData.repo, bracketteData.outputdir, filterRelease, filterAsset)
  .then(function() {
    console.log('All done!');
  })
  .catch(function(err) {
    console.log('oh noooo')
    console.error(err.message);
    // Assuming this worked...
    const zipname = `brackette-${actualVersion}.zip`
    if (fs.existsSync('../' + zipname)){
      // it exists so let's go!
      console.log('please wait...');
      const zip = new admzip('../' + zipname)
      const zipEntries = zip.getEntries();
      zip.extractAllTo('../', true);
      fs.unlink('../' + zipname);
      console.log('done')
    } else {
      console.error("There was an error! Could not find the zip file that we need...");
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
  return asset.name.indexOf(`brackette-`) >= 0;
}
