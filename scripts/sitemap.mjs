import { SitemapStream } from "sitemap";
import { readFileSync, createWriteStream } from "fs";

const BASE_URL = process.env.GITHUB_ACTIONS
  ? "https://njt1982.github.io/minecraft-item-browser"
  : "http://localhost:8080/minecraft-item-browser";

const OUTPUT_PATH = process.env.GITHUB_ACTIONS
  ? "./dist/sitemap.xml"
  : "./public/sitemap.xml";

const items = JSON.parse(readFileSync("./public/js/items.json"));
console.log(items.length);

const sitemap = new SitemapStream();
const writeStream = createWriteStream(OUTPUT_PATH);
sitemap.pipe(writeStream);

items.map(item =>
  sitemap.write({
    url: `${BASE_URL}/#/${item.name}`,
    changefreq: "daily",
    priority: 0.3
  })
);

sitemap.end();
