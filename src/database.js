/* eslint-env jquery */
/* eslint-disable no-console */

import Dexie from "dexie";
import router from "./router";

Dexie.delete("minecraft");

const db = new Dexie("minecraft");
db.version(1).stores({
  items: "++id, &name, displayName, texture",
  recipes:
    "++id, *ingredients, *result.id, type, inShape, base, addition, result",
});

db.open();

db.on("ready", (db) => {
  db.items.count((count) => {
    if (count > 0) {
      console.log("Already populated");
    } else {
      console.log("Database is empty. Populating from ajax call...");
      const itemsPromise = new Promise((resolve, reject) => {
        $.ajax("/minecraft-item-browser/js/items.json", {
          type: "get",
          dataType: "json",
          error: function (xhr, textStatus) {
            // Rejecting promise to make db.open() fail.
            reject(textStatus);
          },
          success: function (data) {
            // Resolving Promise will launch then() below.
            resolve(data);
          },
        });
      });
      const recipesPromise = new Promise((resolve, reject) => {
        $.ajax("/minecraft-item-browser/js/recipes.json", {
          type: "get",
          dataType: "json",
          error: (xhr, textStatus) => {
            // Rejecting promise to make db.open() fail.
            reject(textStatus);
          },
          success: (data) => {
            // Resolving Promise will launch then() below.
            resolve(data);
          },
        });
      });

      const routeValue = router.currentRoute.value;
      new Promise.all([itemsPromise, recipesPromise])
        .then((data) => {
          console.log("Got ajax response. Adding objects.", data);
          // By returning the a promise, framework will keep
          // waiting for this promise to complete before resuming other
          // db-operations.
          console.log("Calling bulkAdd() to insert objects...");
          return new Promise.all([
            db.items.bulkAdd(data[0]),
            db.recipes.bulkAdd(data[1]),
          ]);
          // @TODO - reload is a hack otherwise a preloaded search doesn't retrigger.
        })
        .then(() => {
          console.log("Done populating.");
          return db.items.get({
            name: routeValue.params.item_name,
          });
        })
        .then((item) => {
          const matchedRoute = routeValue.matched[0].instances.default;
          matchedRoute.setSelectedItem(item);
        });
    }
  });
});

export default db;
