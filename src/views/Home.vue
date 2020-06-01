<template>
  <div class="container">
    <div class="row">
      <Sidebar v-on:runSearch="updateQuery" :results="results" />
      <ResultView :item="selectedItem" />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import ResultView from "@/components/ResultView.vue";
import db from "@/database";

export default {
  components: {
    Sidebar,
    ResultView
  },
  data() {
    return {
      results: [],
      selectedItem: undefined
    };
  },
  methods: {
    updateQuery(query) {
      if (query.length) {
        let self = this;
        let regex = new RegExp(query, "i");

        db.items
          .filter(item => regex.test(item.displayName))
          .limit(10)
          .toArray()
          .then(function(results) {
            self.results = results;
          });
      } else {
        this.results = [];
      }
    }
  },
  watch: {
    "$route.params": {
      immediate: true,
      handler(routeParams) {
        let self = this;
        if (!routeParams.item_name) {
          return;
        }

        db.items
          .where("name")
          .equals(routeParams.item_name)
          .first()
          .then(function(item) {
            if (item) {
              self.selectedItem = item;
            }
          });
      }
    }
  }
};
</script>
