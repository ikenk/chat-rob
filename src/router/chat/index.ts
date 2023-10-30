export const chatRoutes = [
  //聊天界面路由
  {
    path: "/chat/:params",
    name: "chat",
    component: () => import("@/views/chat/index.vue"),
    meta: {},
  },
  //登陆界面路由
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {},
  },
];
