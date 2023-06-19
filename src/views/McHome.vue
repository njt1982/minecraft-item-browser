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
import { ref } from "vue";

export default {
  components: {
    McSidebar,
    McResultView,
  },
  setup() {
    const selectedItem = ref(undefined);
    const results = ref([]);
    return { selectedItem, results };
  },
  methods: {
    setSelectedItem(item) {
      console.log("SET ITEM", item);
      this.selectedItem = item;
    },
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
        if (!routeParams.item_name) {
          return;
        }

        db.items.get({ name: routeParams.item_name }).then((item) => {
          console.log("Found Item: ", item);
          if (item) {
            this.setSelectedItem(item);
          }
        });
      },
    },
  },
};
</script>
