const StreamZip = require("node-stream-zip");
const fs = require("fs");

const MC_VERSION = "1.16.4";

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
  return s.split(":").pop();
};

const getItemKey = function(o) {
  if (typeof o == "string") {
    return makeKey(o);
  } else if (o.item) {
    return makeKey(o.item);
  } else if (o.tag) {
    return makeKey(o.tag);
  }
  return false;
};

const getTexturePathForKey = function(key) {
  try {
    key = makeKey(key);
    const path = "assets/minecraft/models/" + key + ".json";
    const data = JSON.parse(zip.entryDataSync(path).toString());

    if (data.textures) {
      const textureChoices = Object.keys(data.textures);
      if (textureChoices.length > 1) {
        console.log("Multiple choices: ", textureChoices);
        if (data.textures.front) {
          // Commonly for things like furnaces
          return data.textures.front;
        } else if (data.textures.side) {
          // Bookshelf?
          return data.textures.side;
        } else if (data.textures.beacon) {
          // Beacon is odd...
          return data.textures.beacon;
        } else if (key === "block/cartography_table") {
          return data.textures.up;
        }
      }

      // Everything else use the first...
      return data.textures[textureChoices[0]];
    } else if (data.parent) {
      // TODO builtin
      return getTexturePathForKey(data.parent);
    }
  } catch (e) {
    console.log("ERROR: ", e, ". For Key: ", key);
  }
  return null;
};

const getTexture = function(key) {
  let texturePath = getTexturePathForKey(key);
  try {
    if (texturePath) {
      // Strip any preceeding colon namespace (eg minecraft:item/blah)
      texturePath = makeKey(texturePath);
      texturePath = "assets/minecraft/textures/" + texturePath + ".png";
      return zip.entryDataSync(texturePath).toString("base64");
    } else {
      throw new Error("Missing Texture!");
    }
  } catch (e) {
    console.log("ERROR: ", e);
    console.log("For key: ", key, ". For texturePath: ", texturePath);
  }
};

const lookupItemFromTag = function(key) {
  key = makeKey(key);
  const path = "data/minecraft/tags/items/" + key + ".json";
  let tagData = JSON.parse(zip.entryDataSync(path).toString());

  // TODO - bit maff
  // If the first tag (that we use) is a hash, then it is a tag itself... recurse!
  if (tagData["values"][0][0] === "#") {
    console.log("Nested tags for: ", key);
    tagData = lookupItemFromTag(tagData["values"][0]);
  }

  return tagData;
};

const makeItem = function(sourceItem) {
  const k = getItemKey(sourceItem);

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
        name: k
      };

      let tagTextureKey = k;
      if (sourceItem.tag) {
        // @TODO
        // console.log(sourceItem);
        const tagData = lookupItemFromTag(k);
        item.displayName = k; // @TODO - better name
        tagTextureKey = makeKey(tagData["values"][0]);
      } else {
        item.displayName = itemTitles[k];
      }

      let prefix = "item";
      if (tagTextureKey == "logs_that_burn") {
        console.log("logs_that_burn", sourceItem);
        prefix = "block";
      }
      item.texture = getTexture(prefix + "/" + tagTextureKey);

      // Add to the hash and return the item.
      items[k] = item;
      return item;
    }
  } else {
    // No key...
    console.log("NO KEY ERROR: ", sourceItem);
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
        } else {
          console.log("ERROR: Cant find item: " + k);
        }
      }
    }
  } else {
    m = makeItem(a);
    if (m) {
      list.push(m);
    } else {
      console.log("ERROR: Cant find item: " + a);
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
        console.log("PROCESSING: ", data.type, " : ", path);
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
            let v = data.key[k];
            if (Array.isArray(v)) {
              // @TODO - This means the recipe has options for this slot
              // Example: A torch can be made with coal or charchol above a stick. Or TNT with sand or red_sand.
              console.log("WARNING: Array found for recipe for: ", k, v);
              v = v.pop();
            }
            map[k] = ingredients.find(i => i.name == getItemKey(v));
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
