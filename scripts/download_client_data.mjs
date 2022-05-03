import fetch from "node-fetch";
import https from "https";
import fs from "fs";

const MC_VERSION = "1.18.2";

console.log("Getting Manifest from Mojang");
fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
  .then(res => res.json())
  .then(json => {
    // do something with JSON
    const mc_url = json.versions.find(item => item.id == MC_VERSION).url;
    console.log("Downloading data for " + MC_VERSION + ": " + mc_url);

    fetch(mc_url)
      .then(res => res.json())
      .then(json => {
        const mc_client_url = json.downloads.client.url;
        console.log("Got data, downloading JAR file: " + mc_client_url);
        const file = fs.createWriteStream(MC_VERSION + ".jar");
        https.get(mc_client_url, function(response) {
          response.pipe(file);
        });
      });
  });
