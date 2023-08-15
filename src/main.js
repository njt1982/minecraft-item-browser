import { createApp } from "vue";
import VueGtag from "vue-gtag";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.vue";
import router from "./router";
window.$ = require("jquery");

const app = createApp(App);

app.use(router);

app.use(
  VueGtag,
  {
    config: { id: "UA-527778-21" },
  },
  router,
);

app.mount("#app");
