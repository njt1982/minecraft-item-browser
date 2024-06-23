<template>
  <div
    v-if="selectedItem"
    class="col-md-9"
  >
    <h1 class="mb-5">
      {{ selectedItem.displayName }}
    </h1>

    <div
      v-if="created_by.length"
      class="mb-4"
    >
      <h2>Created By</h2>
      <div class="row">
        <McRecipe
          v-for="recipe in created_by"
          :key="recipe.id"
          :recipe="recipe"
          :suggested-input="selectedItem"
          show-footer
        />
      </div>
    </div>

    <div
      v-if="used_in.length"
      class="mb-4"
    >
      <h2>Used In</h2>
      <div class="row">
        <McRecipe
          v-for="recipe in used_in"
          :key="recipe.id"
          :recipe="recipe"
          :suggested-input="selectedItem"
          show-header
          show-footer
        />
      </div>
    </div>

    <div
      v-if="creates.length"
      class="mb-4"
    >
      <h2>Creates</h2>
      <div class="row">
        <McRecipe
          v-for="recipe in creates"
          :key="recipe.id"
          :recipe="recipe"
          :suggested-input="selectedItem"
          show-header
          show-footer
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="col-md-9"
  >
    <p>Do a search and select an item.</p>
  </div>
</template>

<script>
import db from "@/database";
import McRecipe from "./McRecipe";

export default {
  components: {
    McRecipe,
  },
  props: {
    selectedItem: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      created_by: [],
      used_in: [],
      creates: [],
    };
  },
  watch: {
    selectedItem: function (newItem) {
      const createsMapping = {
        crafting_table: ["crafting_shapeless", "crafting_shaped"],
        furnace: ["smelting"],
        stonecutter: ["stonecutting"],
        smithing_table: ["smithing"],
        blast_furnace: ["blasting"],
        smoker: ["smoking"],
        campfire: ["campfire_cooking"],
        brewing_stand: ["brewing"],
      };

      let self = this;
      db.recipes
        .where("result.id")
        .equals(newItem.id)
        .toArray()
        .then(function (items) {
          self.created_by = items;
        });

      db.recipes
        .where("ingredients")
        .equals(newItem.id)
        .toArray()
        .then(function (items) {
          self.used_in = items;
        });

      if (createsMapping[newItem.name]) {
        db.recipes
          .where("type")
          .anyOf(createsMapping[newItem.name])
          .toArray()
          .then(function (items) {
            self.creates = items;
          });
      } else {
        this.creates = [];
      }
    },
  },
};
</script>
