<template>
  <div class="col-md-6 mb-3" v-if="isReady">
    <div class="card recipe">
      <div class="card-header">
        <h4 class="mb-0">{{ createsItem.displayName }}</h4>
      </div>
      <div class="card-body d-flex">
        <div v-if="inputGrid" class="input-recipe">
          <div v-for="(row, index) in inputGrid" :key="index">
            <span v-for="(col, index) in row" :key="index">
              <router-link
                :to="{
                  name: 'Home',
                  params: { item_name: getIngredientItem(col).name }
                }"
                class="mc-block"
                v-if="col"
              >
                <img :src="getIngredientItem(col).texture" class="mc-block" />
              </router-link>
            </span>
          </div>
        </div>

        <i class="fa fa-chevron-right"></i>

        <router-link
          :to="{
            name: 'Home',
            params: { item_name: createsItem.name }
          }"
          class="mc-block"
        >
          <img class="mc-block" :src="createsItem.texture" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/database";

export default {
  props: ["recipe"],
  data() {
    return {
      createsItem: undefined,
      loadedIngredients: undefined
    };
  },
  computed: {
    isReady() {
      return !!this.createsItem && !!this.loadedIngredients;
    },
    inputGrid() {
      let grid = [[], [], []];
      for (var i = 0; i < 9; i++) {
        let row = Math.floor(i / 3),
          col = i % 3;

        // Item has specific shape, but its upside down (https://github.com/PrismarineJS/minecraft-data/issues/231)...
        if (this.recipe.inShape) {
          if (this.recipe.inShape[2 - row]) {
            grid[row][col] = this.recipe.inShape[2 - row][col];
          } else {
            grid[row][col] = null;
          }
        }
        // No shape, just list of ingredients (1-9) to gridyify
        else if (this.recipe.ingredients) {
          grid[row][col] = this.recipe.ingredients[i];
        }
      }
      return grid;
    }
  },
  methods: {
    getIngredientItem(id) {
      return this.loadedIngredients.find(loadedItem => loadedItem.id == id);
    }
  },
  created() {
    db.items.get(this.recipe.result.id).then(item => {
      this.createsItem = item;
    });

    db.items.bulkGet(this.recipe.ingredients).then(items => {
      this.loadedIngredients = items;
    });
  }
};
</script>