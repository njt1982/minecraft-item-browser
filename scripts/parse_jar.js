const StreamZip = require("node-stream-zip");
const fs = require("fs");
const mcAssets = require("minecraft-assets")("1.16.1");

const MC_VERSION = "1.16.2";

const zip = new StreamZip({
  file: MC_VERSION + ".jar",
  storeEntries: true
});
var itemTitles = {},
  items = {},
  recipes = [];

const writeJson = function(fileName, data, debug = false) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, debug ? 2 : null));
};

const makeKey = function(s) {
  return s.split(":")[1];
};

const getItemKey = function(o) {
  if (typeof o == "string") {
    return makeKey(o);
  } else if (o.item) {
    return makeKey(o.item);
  }
  return false;
};

const makeItem = function(item) {
  if (item.tag) {
    // @TODO
    // console.log(item);
  } else {
    const k = getItemKey(item);
    // We have an item key
    if (k) {
      // This item exists, return it,
      if (items[k]) {
        return items[k];
      } else {
        // Item template
        const item = {
          // New item! ID is it's offset in the hash.
          id: Object.keys(items).length,
          displayName: itemTitles[k],
          name: k,
          texture: mcAssets.textureContent[k].texture
        };
        // @TODO - load the texture!
        // Add to the hash and return the item.
        items[k] = item;
        return item;
      }
    } else {
      // If we get here there is an error handling the makeItem...
      console.log("ERROR");
      console.log(item);
    }
  }
};

const parseItemList = function(a) {
  var list = [],
    m;
  if (Array.isArray(a)) {
    for (const k of a) {
      // Most of the time if "a" is an array, it an array if {item:'blah'}...
      // but sometimes it is an array of {item:'blah'}. Consistency, eh.
      if (Array.isArray(k)) {
        list = list.concat(parseItemList(k));
      } else {
        m = makeItem(k);
        if (m) {
          list.push(m);
        }
      }
    }
  } else {
    m = makeItem(a);
    if (m) {
      list.push(m);
    }
  }
  return list;
};

zip.on("ready", () => {
  console.log("Entries read: " + zip.entriesCount);

  const lang = JSON.parse(
    zip.entryDataSync("assets/minecraft/lang/en_us.json").toString()
  );
  const filterRegex = /^(block|item)\.minecraft\.(?<name>[^\\.]+)$/;
  var m;
  for (const key of Object.keys(lang).sort()) {
    if ((m = key.match(filterRegex))) {
      itemTitles[m.groups.name] = lang[key];
    }
  }
  writeJson("public/js/titles.json", itemTitles);

  const jarEntries = zip.entries();
  for (const path of Object.keys(jarEntries)) {
    // Is a recipe ?
    if (path.indexOf("data/minecraft/recipes") === 0) {
      // Load recipe
      const data = JSON.parse(zip.entryDataSync(path).toString());

      if (data.type) {
        var recipe = {
          type: makeKey(data.type)
        };
        var ingredients = undefined;
        if (data.type == "minecraft:crafting_shaped") {
          ingredients = parseItemList(Object.values(data.key));
          recipe.ingredients = ingredients.map(i => i.id);

          // Map the ingredient items to the key codes.
          var map = {};
          for (var k in data.key) {
            const v = data.key[k];
            if (Array.isArray(v)) {
              // @TODO - what about the array issue..
              map[k] = null;
            } else {
              map[k] = ingredients.find(i => i.name == getItemKey(v));
            }
          }

          if (data.pattern) {
            recipe.inShape = data.pattern.map(row => {
              return row.split("").map(col => {
                return map[col] ? map[col].id : null;
              });
            });
          }
        } else if (data.type == "minecraft:crafting_shapeless") {
          ingredients = parseItemList(data.ingredients);
          recipe.ingredients = ingredients.map(i => i.id);
        } else if (data.type === "minecraft:smelting") {
          ingredients = parseItemList(data.ingredient);
          recipe.ingredients = ingredients.map(i => i.id);
        } else if (data.type == "minecraft:stonecutting") {
          ingredients = parseItemList(data.ingredient);
          recipe.ingredients = ingredients.map(i => i.id);
        } else if (data.type == "minecraft:smithing") {
          recipe.base = makeItem(data.base).id;
          recipe.addition = makeItem(data.addition).id;
          recipe.ingredients = [recipe.base, recipe.addition];
        } else if (data.type == "minecraft:blasting") {
          ingredients = parseItemList(data.ingredient);
          recipe.ingredients = ingredients.map(i => i.id);
        } else if (data.type == "minecraft:smoking") {
          ingredients = parseItemList(data.ingredient);
          recipe.ingredients = ingredients.map(i => i.id);
        } else if (data.type == "minecraft:campfire_cooking") {
          ingredients = parseItemList(data.ingredient);
          recipe.ingredients = ingredients.map(i => i.id);
        } else {
          console.log("Skipping: " + data.type);
          recipe = false;
        }

        if (recipe) {
          recipe.id = Object.keys(recipes).length;
          const m = makeItem(data.result);
          recipe.result = {
            id: m.id,
            count: data.result.count ? data.result.count : 1
          };
          recipes.push(recipe);
        }
      }
    }
  }

  zip.close();

  items = Object.values(items);
  writeJson("public/js/items.json", items);

  writeJson("public/js/recipes.json", recipes);
});
