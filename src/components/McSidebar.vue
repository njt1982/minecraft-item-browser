<template>
  <div class="col-md-3 mb-4">
    <h4>Search</h4>
    <div
      id="search_form"
      class="form-group mb-3"
    >
      <div class="input-group">
        <span class="input-group-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
            />
          </svg>
        </span>
        <input
          v-model="mutableQuery"
          type="search"
          class="form-control"
          placeholder="Search"
          @input="runSearch"
        >
      </div>
    </div>

    <h4>Results</h4>
    <div
      id="search_results"
      class="list-group"
    >
      <McItem
        v-for="item in results"
        :key="item.id"
        :items="[item]"
        :show-name="true"
        class="list-group-item"
      />
    </div>
  </div>
</template>

<script>
import _debounce from "lodash/debounce";
import McItem from "@/components/McItem";

export default {
  components: {
    McItem,
  },
  props: {
    results: {
      type: Array,
      default: () => [],
    },
    selectedItem: {
      type: Object,
      default: null,
    },
  },
  emits: ["runSearch"],
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
  watch: {
    selectedItem: function (newItem) {
      if (this.mutableQuery == "") {
        this.mutableQuery = newItem.displayName;
        this.$emit("runSearch", this.mutableQuery);
      }
    },
  },
};
</script>
