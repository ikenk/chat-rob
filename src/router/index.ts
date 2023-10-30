import { createRouter, createWebHistory } from "vue-router";
import { useUserInfoStore } from "@/stores/userInfo";
import { gsapRoutes } from "./test/gsap";
import { canvasRoutes } from "./test/canvas";
import { chatRoutes } from "./chat";
import { trimPicRoutes } from "./test/trimPic";
import { mantianxingRoutes } from "./test/mantianxing";
//静态路由
const constRoutes = [
  {
    path: "/",
    redirect: "/chat/model=3-5-turbo",
    name: "root",
    meta: {},
  },
  ...chatRoutes,
  ...canvasRoutes,
  ...gsapRoutes,
  ...trimPicRoutes,
  ...mantianxingRoutes,
  //404路由
  {
    path: "/:pathMatch(.*)",
    name: "404",
    component: () => import("@/views/notfound/index.vue"),
    meta: {},
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constRoutes,
});

// 路由白名单
const WHITE_LIST = ["login", "404"];

router.beforeEach((to, from, next) => {
  // console.log(to);
  if (WHITE_LIST.includes(to.name)) {
    next();
  } else {
    const store = useUserInfoStore();
    if (store.getToken("user-token")) {
      next();
    } else {
      return next({ name: "login" });
    }
  }
});

export default router;
