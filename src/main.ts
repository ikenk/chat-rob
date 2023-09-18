import { createApp } from 'vue'
// 配置了按需导入elementui-plus，因此全局导入方式就可以注销了
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import './styles/index.scss'
import App from './App.vue'
import router from './router' //导入路由
import { createPinia  } from 'pinia' //导入pinia
import piniaPersist from 'pinia-plugin-persist'//导入pinia持久化插件

const app = createApp(App)

app.use(router) //使用路由插件

const pinia = createPinia() //pinia插件
pinia.use(piniaPersist) //pinia使用持久化插件
app.use(pinia) //使用pinia插件

// app.use(ElementPlus) // 配置了按需导入elementui-plus，因此全局导入方式就可以注销了
app.mount('#app')