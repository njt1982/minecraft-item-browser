import Vue from "vue";
import VueRouter from "vue-router";
import VueAnalytics from "vue-analytics";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/:item_name?",
      name: "Home",
      component: Home,
      props: true
    }
  ]
});

Vue.use(VueAnalytics, {
  id: "UA-527778-21",
  router
});

export default router;
