import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";

const router = createRouter({
  history: createWebHashHistory(),
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
