import { createRouter, createWebHistory } from 'vue-router'


//静态路由
const constRoutes= [
  {
    path:'/',
    redirect:'/chat/model=3-5-turbo'
  },
  //聊天界面路由
  {
    path:'/chat/:params',
    name:'chat',
    component:()=>import('@/views/chat/index.vue'),
    meta:{}
  },
  //登陆界面路由
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/login/index.vue'),
    meta:{}
  },
  //404路由
  {
    path:'/:pathMatch(.*)',
    name:'notfound',
    component:()=>import('@/views/notfound/index.vue'),
    meta:{}
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constRoutes,
})

// 路由白名单
const WHITE_LIST = ['/login', '/404']

export default router