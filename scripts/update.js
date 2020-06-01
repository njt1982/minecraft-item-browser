// Update file from submodules

const MC_VERSION = "1.15.2";
const ITEMS_BASE_PATH = "PrismarineJS/minecraft-data/data/pc/" + MC_VERSION;
const TEXTURES_BASE_PATH = "PrismarineJS/minecraft-assets/data/" + MC_VERSION;

const fs = require("fs");

fs.readFile(TEXTURES_BASE_PATH + "/texture_content.json", function(err, data) {
  if (err) throw err;
  let texture_content = JSON.parse(data);
  // let out = JSON.stringify(texture_content, null, 0);
  // fs.writeFileSync("public/js/texture_content.json", out);
  // console.log("Tetures Updated");

  fs.readFile(ITEMS_BASE_PATH + "/items.json", function(err, data) {
    if (err) throw err;
    let items = JSON.parse(data);
    items = items.map(function(item) {
      item.texture = texture_content.find(t => t.name == item.name).texture;
      return item;
    });

    let out = JSON.stringify(items, null, 0);
    fs.writeFileSync("public/js/items.json", out);
    console.log("Items Updated");
  });
});

fs.readFile(ITEMS_BASE_PATH + "/recipes.json", function(err, data) {
  if (err) throw err;
  let sourceRecipes = JSON.parse(data);
  // Need to process the recipes into something more Dexie friendly.
  var recipes = [];
  Object.keys(sourceRecipes).forEach(key => {
    sourceRecipes[key].forEach(recipe => {
      let packet = recipe;
      // If there are no ingredients, use inShape to make a distinct list (for indexing).
      if (!packet.ingredients) {
        // Flatten the inShape and use filter to get unique values.
        packet.ingredients = packet.inShape
          .reduce((acc, val) => acc.concat(val), []) // .flat() isn't in my local Node env...
          .filter((v, i, a) => v > 0 && a.indexOf(v) === i); // Dedupe and remove nulls
      }

      recipes.push(packet);
    });
  });
  recipes = recipes.map((recipe, i) => {
    return { ...{ id: i }, ...recipe };
  });
  let out = JSON.stringify(recipes, null, 0);
  fs.writeFileSync("public/js/recipes.json", out);
  console.log("Recipes Updated");
});
