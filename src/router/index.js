import { createRouter, createWebHistory } from "vue-router";
import McHome from "@/views/McHome.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' }
    },
    {
      path: "/minecraft-item-browser/:item_name?",
      name: "Home",
      component: McHome,
      props: true,
    },
  ],
});

export default router;
