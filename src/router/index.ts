import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/view2",
    name: "view2",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HomeView2.vue"),
  },
  {
    path: "/view3",
    name: "view3",
    component: () => import("../views/HomeView3.vue"),
  },
  {
    path: "/view4",
    name: "view4",
    component: () => import("../views/HomeView4.vue"),
  },
  {
    path: "/view5",
    name: "view5",
    component: () => import("../views/HomeView5.vue"),
  },
  {
    path: "/view6",
    name: "view6",
    component: () => import("../views/HomeView6.vue"),
  },
  {
    path: "/view7",
    name: "view7",
    component: () => import("../views/HomeView7.vue"),
  },
  {
    path: "/view8",
    name: "view8",
    component: () => import("../views/HomeView8.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
