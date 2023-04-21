import fetch from "node-fetch";
import https from "https";
import fs from "fs";

let MC_VERSION = undefined;

console.log("Getting Manifest from Mojang");
fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
  .then((res) => res.json())
  .then((json) => {
    if (!MC_VERSION) {
      MC_VERSION = json.latest.release; 
    }
    const mc_url = json.versions.find((item) => item.id == MC_VERSION).url;
    console.log("Downloading data for " + MC_VERSION + ": " + mc_url);

    fetch(mc_url)
      .then((res) => res.json())
      .then((json) => {
        const mc_client_url = json.downloads.client.url;
        console.log("Got data, downloading JAR file: " + mc_client_url);
        const file = fs.createWriteStream("client.jar");
        https.get(mc_client_url, (response) => {
          response.pipe(file);
        });
      });
  });
