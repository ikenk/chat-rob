import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//自动引入组件的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import path  from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //自动引入插件的组件配置
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  //开发服务器
  server:{
    // port:3000
  },
  resolve:{
    // 配置路径别名
    alias:{
      '@':path.resolve(__dirname,'src')
    }
  }
})
