import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";

//自动引入组件的插件
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import path from "path";

// 💚 为 Element Plus 按需引入样式。🌎 替换默认语言。
import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 配置路径别名
    alias: {
      //三种写法都行，是一样的
      "@": path.resolve(__dirname, "src"),
      // '@/':`${path.resolve(__dirname,'src')}/`
      // '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;
        @use "@/styles/mixin.scss" as *;
        @use "@/styles/variable.scss" as *;
        `,
      },
    },
  },
  plugins: [
    vue(),
    //eslint配置
    eslintPlugin({
      include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
    }),
    //自动引入插件的组件配置
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver()],
      dts: "./src/types/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      // dirs 指定组件所在位置，默认为 src/components
      // 可以让我们使用自己定义组件的时候免去 import 的麻烦
      dirs: ["src/components/"],
      // 配置需要将哪些后缀类型的文件进行自动按需引入
      extensions: ["vue"],
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
      dts: "./src/types/components.d.ts",
    }),
    // 使用 unplugin-element-plus
    ElementPlus({
      // options
      // useSource: true,
    }),
  ],
  //开发服务器
  server: {
    // port:300
  },
});
