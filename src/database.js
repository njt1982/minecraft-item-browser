import Dexie from "dexie";
import router from "./router";

Dexie.delete("minecraft");

const db = new Dexie("minecraft");
db.version(1).stores({
  items: "++id, &name",
  recipes:
    "++id, *ingredients, *result.id, type",
});

db.open();

db.on("ready", (db) => {
  db.items.count((count) => {
    if (count > 0) {
      console.log("Already populated");
    } else {
      console.log("Database is empty. Fetching JSON to populate DB.");
      const itemsPromise = fetch("/minecraft-item-browser/js/items.json").then(
        (response) => response.json(),
      );
      const recipesPromise = fetch(
        "/minecraft-item-browser/js/recipes.json",
      ).then((response) => response.json());
      const routeValue = router.currentRoute.value;
      new Promise.all([itemsPromise, recipesPromise])
        .then((data) => {
          // By returning the a promise, framework will keep
          // waiting for this promise to complete before resuming other
          // db-operations.
          return new Promise.all([
            db.items.bulkAdd(data[0]),
            db.recipes.bulkAdd(data[1]),
          ]);
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
