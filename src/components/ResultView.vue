<template>
  <div v-if="item" class="col-md-9">
    <h1 class="mb-5">{{ item.displayName }}</h1>

    <div v-if="creates.length" class="mb-4">
      <h2>Created By</h2>
      <div class="row">
        <Recipe
          v-for="recipe in creates"
          :key="recipe.id"
          :recipe="recipe"
          :suggestedInput="item"
        />
      </div>
    </div>
    <div v-if="used_id.length" class="mb-4">
      <h2>Used In</h2>
      <div class="row">
        <Recipe
          v-for="recipe in used_id"
          :key="recipe.id"
          :recipe="recipe"
          :suggestedInput="item"
          showHeader
        />
      </div>
    </div>
  </div>
  <div v-else class="col-md-9">
    <p>Do a search and select an item.</p>
  </div>
</template>

<script>
import db from "@/database";
import Recipe from "./Recipe";

export default {
  props: {
    item: Object
  },
  components: {
    Recipe
  },
  data() {
    return {
      creates: [],
      used_id: []
    };
  },
  watch: {
    item: function(newItem) {
      let self = this;
      db.recipes
        .where("result.id")
        .equals(newItem.id)
        .toArray()
        .then(function(items) {
          self.creates = items;
        });

      db.recipes
        .where("ingredients")
        .equals(newItem.id)
        .toArray()
        .then(function(items) {
          self.used_id = items;
        });
    }
  }
};
</script>
