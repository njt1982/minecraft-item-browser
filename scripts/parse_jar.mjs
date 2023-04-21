import StreamZip from "node-stream-zip";
import fs from "fs";

const zip = new StreamZip({
  file: "client.jar",
  storeEntries: true,
});
var itemTitles = {},
  items = {},
  textures = [],
  textureMap = {},
  recipes = [];

const effectColourMap = {
  water: [55, 93, 196, 1.0],
  awkward: [56, 91, 199, 1.0],
  leaping: [32, 253, 76, 1.0],
  fire_resistance: [224, 153, 54, 1.0],
  slowness: [89, 107, 126, 1.0],
  swiftness: [122, 174, 195, 1.0],
  water_breathing: [47, 81, 152, 1.0],
  healing: [245, 35, 35, 1.0],
  harming: [67, 10, 9, 1.0],
  poison: [78, 146, 48, 1.0],
  night_vision: [30, 32, 154, 1.0],
  invisibility: [126, 130, 144, 1.0],
  regeneration: [241, 98, 252, 1.0],
  strength: [145, 36, 35, 1.0],
  weakness: [70, 76, 69, 1.0],
};

const writeJson = (filename, data, debug = false) => {
  console.log("Writing JS: ", filename);
  fs.writeFileSync(filename, JSON.stringify(data, null, debug ? 2 : null));
};

const writeCSS = (filename, items) => {
  console.log("Writing CSS: ", filename);
  fs.writeFileSync(filename, items.join("\n"));
};

const textureCss = (textures) => {
  return textures.map(
    (t, i) =>
      ".texture-" + i + " { --imgUrl: url('data:image/png;base64," + t + "') }"
  );
};

const makeKey = (s) => {
  return s.split(":").pop();
};

const getItemKey = (o) => {
  if (typeof o == "string") {
    return makeKey(o);
  } else if (o.item) {
    return makeKey(o.item);
  } else if (o.tag) {
    return makeKey(o.tag);
  }
  return false;
};

const getTexturePathsForKey = (key) => {
  try {
    key = makeKey(key);
    const path = "assets/minecraft/models/" + key + ".json";
    const data = JSON.parse(zip.entryDataSync(path).toString());

    if (data.textures) {
      const textureKeys = Object.keys(data.textures);

      if (textureKeys.length > 1) {
        console.log("Multiple choices: ", textureKeys);

        if (data.textures.front) {
          // Commonly for things like furnaces
          return [data.textures.front];
        } else if (data.textures.side) {
          // Bookshelf?
          return [data.textures.side];
        } else if (data.textures.beacon) {
          // Beacon is odd...
          return [data.textures.beacon];
        } else if (
          [
            "block/cartography_table",
            "block/crafting_table",
            "block/fletching_table",
          ].includes(key)
        ) {
          return [data.textures.up];
        } else if (["block/smithing_table"].includes(key)) {
          return [data.textures.south];
        } else if (textureKeys[0].indexOf("layer") === 0) {
          // This item has layered textures
          return Object.values(data.textures);
        }
      }

      // Everything else use the first...
      return [data.textures[textureKeys[0]]];
    } else if (data.parent) {
      // TODO builtin
      return getTexturePathsForKey(data.parent);
    }
  } catch (e) {
    console.log("ERROR LOADING MODEL: ", e, ". For Key: ", key);
  }
  return [];
};

const makeTextures = (key) => {
  if (textureMap[key]) {
    return textureMap[key];
  }

  let texturePaths = getTexturePathsForKey(key);
  try {
    if (texturePaths.length) {
      const textureIds = [];
      texturePaths.forEach((texturePath) => {
        // Strip any preceeding colon namespace (eg minecraft:item/blah)
        const key = makeKey(texturePath);
        const path = "assets/minecraft/textures/" + key + ".png";
        const idx = textures.push(zip.entryDataSync(path).toString("base64"));
        textureIds.push(idx - 1);
      });

      textureMap[key] = textureIds;
      return textureIds;
    } else {
      throw new Error("Missing Texture!");
    }
  } catch (e) {
    console.log("ERROR LOADING TEXTURE: ", e);
    console.log("For key: ", key, ". For texturePaths: ", texturePaths);
  }
};

const lookupItemFromTag = (key) => {
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

const makeItem = (sourceItem) => {
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
        name: k,
        displayName: itemTitles[k],
        textures: undefined,
        tint: undefined,
      };

      let tagTextureKey = k;
      if (sourceItem.tag) {
        const tagData = lookupItemFromTag(k);
        item.displayName = k; // @TODO - better name - eg birch_logs is rubbish
        tagTextureKey = makeKey(tagData["values"][0]);
      } else if (tagTextureKey.indexOf(".") !== -1) {
        // If the texture key contains a dot, we assume its an "effects" item for now.
        // @TODO - this isn't entirely right, but it builds the JSON for now...
        const effectName = tagTextureKey.split(".").pop();

        // Pull out the first part (eg potion) as thats the texture key.
        tagTextureKey = tagTextureKey.split(".")[0];

        // Apply a tint to layer 0 based on the effectName
        if (effectColourMap[effectName]) {
          item.tint = [effectColourMap[effectName]];
        }
      }

      item.textures = makeTextures("item/" + tagTextureKey);

      // Add to the hash and return the item.
      items[k] = item;
      return item;
    }
  } else {
    // No key...
    console.log("NO KEY ERROR: ", sourceItem);
  }
};

const makeRecipe = (data, path) => {
  console.log("PROCESSING: ", data.type, " : ", path);

  var recipe = {
    id: Object.keys(recipes).length,
    type: makeKey(data.type),
    ingredients: [],
    inShape: undefined,
    base: undefined,
    addition: undefined,
    result: undefined,
  };

  if (data.type == "minecraft:crafting_shaped") {
    const ingredients = parseItemList(Object.values(data.key));
    recipe.ingredients = ingredients.map((i) => i.id);

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
      map[k] = ingredients.find((i) => i.name == getItemKey(v));
    }

    if (data.pattern) {
      recipe.inShape = data.pattern.map((row) => {
        return row.split("").map((col) => {
          return map[col] ? map[col].id : null;
        });
      });
    }
  } else if (data.type == "minecraft:crafting_shapeless") {
    recipe.ingredients = parseItemList(data.ingredients).map((i) => i.id);
  } else if (data.type === "minecraft:smelting") {
    recipe.ingredients = parseItemList(data.ingredient).map((i) => i.id);
  } else if (data.type == "minecraft:stonecutting") {
    recipe.ingredients = parseItemList(data.ingredient).map((i) => i.id);
  } else if (data.type == "minecraft:smithing") {
    recipe.base = makeItem(data.base).id;
    recipe.addition = makeItem(data.addition).id;
    recipe.ingredients = [recipe.base, recipe.addition];
  } else if (data.type == "minecraft:blasting") {
    recipe.ingredients = parseItemList(data.ingredient).map((i) => i.id);
  } else if (data.type == "minecraft:smoking") {
    recipe.ingredients = parseItemList(data.ingredient).map((i) => i.id);
  } else if (data.type == "minecraft:campfire_cooking") {
    recipe.ingredients = parseItemList(data.ingredient).map((i) => i.id);
  } else if (data.type == "minecraft:brewing") {
    recipe.base = makeItem(data.base).id;
    recipe.ingredients.push(recipe.base);
    if (data.addition) {
      recipe.addition = makeItem(data.addition).id;
      recipe.ingredients.push(recipe.addition);
    }
  } else {
    console.log("Skipping: " + data.type);
    return null;
  }

  recipe.result = {
    id: makeItem(data.result).id,
    count: data.result.count ? data.result.count : 1,
  };

  recipes.push(recipe);
  return recipe;
};

const parseItemList = (a) => {
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
  const filterRegex =
    /^(block|item)\.minecraft\.(?<name>([^\\.]+|(tipped_arrow|potion|splash_potion|lingering_potion)\.effect\..+))$/;
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
        makeRecipe(data, path);
      }
    }
  }

  // Brewing Recipies
  // @TODO - redstone/glowstone potency modifiers
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.water",        addition: "minecraft:nether_wart",            result: { item: "potion.effect.awkward",         count: 3}}, "BREWING/potion.awkward"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:sugar",                  result: { item: "potion.effect.swiftness",       count: 3}}, "BREWING/potion.swiftness"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:rabbit_foot",            result: { item: "potion.effect.leaping",         count: 3}}, "BREWING/potion.leaping"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:blaze_powder",           result: { item: "potion.effect.strength",        count: 3}}, "BREWING/potion.strength"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:glistering_melon_slice", result: { item: "potion.effect.healing",         count: 3}}, "BREWING/potion.healing"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:spider_eye",             result: { item: "potion.effect.poison",          count: 3}}, "BREWING/potion.poison"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:ghast_tear",             result: { item: "potion.effect.regeneration",    count: 3}}, "BREWING/potion.regeneration"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:magma_cream",            result: { item: "potion.effect.fire_resistance", count: 3}}, "BREWING/potion.fire_resistance"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:pufferfish",             result: { item: "potion.effect.water_breathing", count: 3}}, "BREWING/potion.water_breathing"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:golden_carrot",          result: { item: "potion.effect.night_vision",    count: 3}}, "BREWING/potion.night_vision"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:turtle_helmet",          result: { item: "potion.effect.turtle_master",   count: 3}}, "BREWING/potion.turtle_master"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.awkward",      addition: "minecraft:phantom_membrane",       result: { item: "potion.effect.slow_falling",    count: 3}}, "BREWING/potion.slow_falling"); // prettier-ignore

  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.water",        addition: "minecraft:fermented_spider_eye",   result: { item: "potion.effect.weakness",        count: 3}}, "BREWING/potion.weakness"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.swiftness",    addition: "minecraft:fermented_spider_eye",   result: { item: "potion.effect.slowness",        count: 3}}, "BREWING/potion.slowness"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.leaping",      addition: "minecraft:fermented_spider_eye",   result: { item: "potion.effect.slowness",        count: 3}}, "BREWING/potion.slowness"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.healing",      addition: "minecraft:fermented_spider_eye",   result: { item: "potion.effect.harming",         count: 3}}, "BREWING/potion.harming"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.poison",       addition: "minecraft:fermented_spider_eye",   result: { item: "potion.effect.harming",         count: 3}}, "BREWING/potion.harming"); // prettier-ignore
  makeRecipe({ type: "minecraft:brewing", base: "minecraft:potion.effect.night_vision", addition: "minecraft:fermented_spider_eye",   result: { item: "potion.effect.invisibility",    count: 3}}, "BREWING/potion.invisibility"); // prettier-ignore

  // prettier-ignore
  ["water", "swiftness", "leaping", "strength", "healing", "poison", "regeneration", "fire_resistance", "water_breathing", "night_vision", "turtle_master", "slow_falling", "weakness", "slowness", "harming", "invisibility"].forEach(effect => {
    makeRecipe(
      {
        type: "minecraft:brewing",
        base: "minecraft:potion.effect." + effect,
        addition: "minecraft:gunpowder",
        result: { item: "splash_potion.effect." + effect, count: 3 }
      },
      "BREWING/splash_potion." + effect
    );
    makeRecipe(
      {
        type: "minecraft:brewing",
        base: "minecraft:splash_potion.effect." + effect,
        addition: "minecraft:dragon_breath",
        result: { item: "lingering_potion.effect." + effect, count: 3 }
      },
      "BREWING/lingering_potion." + effect
    );
    makeRecipe(
      {
        type: "minecraft:crafting_shaped",
        pattern: [
          "###",
          "#P#",
          "###"
        ],
        key: {
          "#": {
            "item": "minecraft:arrow"
          },
          "P": {
            "item": "lingering_potion.effect." + effect
          }
        },
        result: { item: "tipped_arrow.effect." + effect, count: 8 }
      },
      "CRAFTING/tipped_arrow." + effect
    );
  });

  writeJson("public/js/items.json", Object.values(items));
  writeJson("public/js/recipes.json", recipes);
  writeCSS("public/css/textures.css", textureCss(textures));
  zip.close();
});
