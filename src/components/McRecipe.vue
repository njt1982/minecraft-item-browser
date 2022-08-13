<template>
  <div class="col-6 col-xl-4 mb-3" v-if="isReady">
    <div class="card recipe">
      <div class="card-header" v-if="showHeader">
        <h4 class="mb-0">{{ createsItem.displayName }}</h4>
      </div>
      <div class="card-body d-flex">
        <div v-if="inputGrid" class="input-recipe">
          <div v-for="(row, index) in inputGrid" :key="index">
            <span class="invslot" v-for="(col, index) in row" :key="index">
              <McItem v-if="col != null" :item="getIngredientItem(col)" />
            </span>
          </div>
        </div>

        <svg
          class="chevron-right"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
          />
        </svg>

        <span class="result">
          <div class="invslot"><McItem :item="createsItem" /></div>
          <span class="count" v-if="recipe.result.count > 1">
            {{ recipe.result.count }}
          </span>
        </span>
      </div>
      <div class="card-footer" v-if="showFooter">
        <McItem :item="this.craftingTableItem" v-bind:show-name="true" />
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/database";
import McItem from "./McItem";

export default {
  props: {
    recipe: Object,
    showHeader: {
      type: Boolean,
      default: false,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
    suggestedInput: {
      type: Object,
      default: undefined,
    },
  },
  components: {
    McItem,
  },
  data() {
    return {
      createsItem: undefined,
      loadedIngredients: undefined,
      craftingTableItem: undefined,
    };
  },
  computed: {
    isReady() {
      return (
        this.createsItem != undefined &&
        this.loadedIngredients != undefined &&
        this.craftingTableItem != undefined
      );
    },
    inputGrid() {
      let grid = [[]];
      if (
        this.recipe.type === "crafting_shaped" ||
        this.recipe.type === "crafting_shapeless"
      ) {
        grid = [[], [], []];
        for (var i = 0; i < 9; i++) {
          let row = Math.floor(i / 3),
            col = i % 3;

          if (this.recipe.inShape) {
            if (this.recipe.inShape[row]) {
              grid[row][col] = this.recipe.inShape[row][col];
            } else {
              grid[row][col] = null;
            }
          }
          // No shape, just list of ingredients (1-9) to gridyify
          else if (this.recipe.ingredients) {
            grid[row][col] = this.recipe.ingredients[i];
          }
        }
      } else if (
        this.recipe.type === "smelting" ||
        this.recipe.type === "blasting" ||
        this.recipe.type === "smoking" ||
        this.recipe.type === "campfire_cooking" ||
        this.recipe.type === "stonecutting"
      ) {
        grid = [[]];
        if (
          this.suggestedInput &&
          this.recipe.ingredients.indexOf(this.suggestedInput.id) !== -1
        ) {
          grid[0][0] = this.suggestedInput.id;
        } else {
          grid[0][0] = this.recipe.ingredients[0];
        }
      } else if (this.recipe.type == "smithing") {
        grid = [[this.recipe.base, this.recipe.addition]];
      } else if (this.recipe.type == "brewing") {
        grid = [[this.recipe.base, this.recipe.addition]];
      }
      return grid;
    },
  },
  methods: {
    getIngredientItem(id) {
      return this.loadedIngredients.find((loadedItem) => loadedItem.id == id);
    },
  },
  created() {
    const craftingTableMap = {
      crafting_shapeless: "crafting_table",
      crafting_shaped: "crafting_table", // Crafting Table
      smelting: "furnace",
      stonecutting: "stonecutter",
      smithing: "smithing_table", // Smithing Table
      blasting: "blast_furnace",
      smoking: "smoker",
      campfire_cooking: "campfire",
      brewing: "brewing_stand",
    };
    db.items.get({ name: craftingTableMap[this.recipe.type] }).then((item) => {
      this.craftingTableItem = item;
    });
    db.items.get(this.recipe.result.id).then((item) => {
      this.createsItem = item;
    });
    db.items.bulkGet(this.recipe.ingredients).then((items) => {
      this.loadedIngredients = items;
    });
  },
};
</script>
