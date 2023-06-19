<template>
  <div class="col-md-3 mb-4">
    <h4>Search</h4>
    <div class="form-group" id="search_form">
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
              />
            </svg>
          </span>
        </div>
        <input
          type="search"
          class="form-control"
          v-model="mutableQuery"
          @input="runSearch"
          placeholder="Search"
        />
      </div>
    </div>

    <h4>Results</h4>
    <div class="list-group" id="search_results">
      <McItem
        v-for="item in results"
        :key="item.id"
        :item="item"
        v-bind:show-name="true"
        class="list-group-item"
      />
    </div>
  </div>
</template>

<script>
import _debounce from "lodash/debounce";
import db from "@/database";
import McItem from "./McItem";

export default {
  props: {
    results: Array,
  },
  components: {
    McItem,
  },
  created() {
    if (this.$route.params.item_name) {
      let self = this;
      db.items.get({ name: this.$route.params.item_name }).then((result) => {
        if (result) {
          self.mutableQuery = result.displayName;
        } else {
          self.mutableQuery = self.$route.params.item_name;
        }
        self.$emit("runSearch", self.mutableQuery);
      });
    }
  },
  data() {
    return {
      mutableQuery: "",
    };
  },
  computed: {
    runSearch() {
      return _debounce(function inputCaptured(e) {
        this.$emit("runSearch", e.srcElement.value);
      }, 50).bind(this);
    },
  },
};
</script>
