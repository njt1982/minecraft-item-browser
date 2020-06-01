import Vue from "vue";
import VueRouter from "vue-router";
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

export default router;
