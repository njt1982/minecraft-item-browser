/* eslint-env jquery */
/* eslint-disable no-console */

import Dexie from "dexie";

const db = new Dexie("minecraft");
db.version(1).stores({
  items: "++id, &name, displayName, stackSize, texture",
  recipes: "++id, *ingredients, *result.id, inShape, result"
});

db.open();

db.on("ready", function() {
  return db.items.count(function(count) {
    if (count > 0) {
      console.log("Already populated");
    } else {
      console.log("Database is empty. Populating from ajax call...");
      let itemsPromise = new Promise(function(resolve, reject) {
        $.ajax("/minecraft-item-browser/js/items.json", {
          type: "get",
          dataType: "json",
          error: function(xhr, textStatus) {
            // Rejecting promise to make db.open() fail.
            reject(textStatus);
          },
          success: function(data) {
            // Resolving Promise will launch then() below.
            resolve(data);
          }
        });
      });
      let recipesPromise = new Promise(function(resolve, reject) {
        $.ajax("/minecraft-item-browser/js/recipes.json", {
          type: "get",
          dataType: "json",
          error: function(xhr, textStatus) {
            // Rejecting promise to make db.open() fail.
            reject(textStatus);
          },
          success: function(data) {
            // Resolving Promise will launch then() below.
            resolve(data);
          }
        });
      });
      new Promise.all([itemsPromise, recipesPromise])
        .then(function(data) {
          console.log("Got ajax response. Adding objects.", data);
          // By returning the a promise, framework will keep
          // waiting for this promise to complete before resuming other
          // db-operations.
          console.log("Calling bulkAdd() to insert objects...");
          return new Promise.all([
            db.items.bulkAdd(data[0]),
            db.recipes.bulkAdd(data[1])
          ]);
        })
        .then(function() {
          console.log("Done populating.");
        });
    }
  });
});

export default db;
