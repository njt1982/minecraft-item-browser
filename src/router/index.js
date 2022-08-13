import { createRouter, createWebHashHistory } from "vue-router";
import McHome from "@/views/McHome.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/:item_name?",
      name: "Home",
      component: McHome,
      props: true,
    },
  ],
});

export default router;
