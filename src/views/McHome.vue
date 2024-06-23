<template>
  <div class="container">
    <div class="row">
      <McSidebar
        :results="results"
        :selected-item="selectedItem"
        @run-search="updateQuery"
      />
      <McResultView :selected-item="selectedItem" />
    </div>
  </div>
</template>

<script>
import McSidebar from "@/components/McSidebar.vue";
import McResultView from "@/components/McResultView.vue";
import db from "@/database";
import { ref } from "vue";
import { Tooltip } from "bootstrap";
import escapeStringRegexp from "escape-string-regexp";

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
  watch: {
    "$route.params": {
      immediate: true,
      handler(routeParams) {
        if (this.tooltipHandler) {
          // TODO - this feels wrong...
          document.querySelectorAll("body > div.tooltip").forEach((el) => {
            el.remove();
          });
        }
        if (!routeParams.item_name) {
          return;
        }

        db.items.get({ name: routeParams.item_name }).then((item) => {
          if (item) {
            this.setSelectedItem(item);
          }
        });
      },
    },
  },
  mounted() {
    this.tooltipHandler = new Tooltip(this.$el, {
      selector: "[data-bs-toggle=tooltip]",
      offset: [0, 24],
    });
  },
  methods: {
    setSelectedItem(item) {
      this.selectedItem = item;
      document.title = item.displayName + " - Minecraft Item Browser";
    },
    updateQuery(query) {
      if (query.length) {
        let self = this;
        let regex = new RegExp(escapeStringRegexp(query), "i");

        db.items
          .filter((item) => regex.test(item.displayName))
          .limit(20)
          .toArray()
          .then(function (results) {
            self.results = results;
          });
      } else {
        this.results = [];
      }
    },
  },
};
</script>
