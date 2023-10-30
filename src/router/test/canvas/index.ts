export const canvasRoutes = [
  {
    path: "/canvas/randomparticles",
    name: "randomparticles",
    component: () => import("@/views/test/canvas_randomparticles.vue"),
  },
  {
    path: "/canvas/explosionparticles",
    name: "explosionparticles",
    component: () => import("@/views/test/canvas_explosionparticles.vue"),
  },
  {
    path: "/canvas/followmouse",
    name: "followmouse",
    component: () => import("@/views/test/canvas_followmouse.vue"),
  },
  {
    path: "/canvas/particleclock",
    name: "particleclock",
    component: () => import("@/views/test/canvas_particleclock.vue"),
  },
];
