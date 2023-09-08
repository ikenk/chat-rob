import { createApp } from 'vue'
// 配置了按需导入elementui-plus，因此全局导入方式就可以注销了
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// app.use(ElementPlus) // 配置了按需导入elementui-plus，因此全局导入方式就可以注销了
app.mount('#app')