<template>
  <div class="container">
    <div class="row">
      <McSidebar v-on:runSearch="updateQuery" :results="results" />
      <McResultView :item="selectedItem" />
    </div>
  </div>
</template>

<script>
import McSidebar from "@/components/McSidebar.vue";
import McResultView from "@/components/McResultView.vue";
import db from "@/database";

export default {
  components: {
    McSidebar,
    McResultView,
  },
  data() {
    return {
      results: [],
      selectedItem: undefined,
    };
  },
  methods: {
    updateQuery(query) {
      if (query.length) {
        let self = this;
        let regex = new RegExp(query, "i");

        db.items
          .filter((item) => regex.test(item.displayName))
          .limit(10)
          .toArray()
          .then(function (results) {
            self.results = results;
          });
      } else {
        this.results = [];
      }
    },
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
          .then(function (item) {
            if (item) {
              self.selectedItem = item;
            }
          });
      },
    },
  },
};
</script>
