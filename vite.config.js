import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueSetupExtend from "vite-plugin-vue-setup-extend";

//
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    // 配置路径别名（@指向 src 目录）
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 开发服务器配置
  server: {
    // 启动后自动打开浏览器
    open: true,

    // 可选：指定打开的路径，默认为 '/'
    // open: '/dashboard',

    // 其他服务器配置
    port: 3000, // 端口号
    host: "localhost", // 主机地址

    proxy: {
      // 代理配置（解决跨域，地址和端口号有一个不一样就是跨域）
      // 将所有/api开头的请求代理到http://localhost:8081
      "/api": {
        target: "http://localhost:8081", // 目标服务器地址
        changeOrigin: true, // 改变请求源
        rewrite: (path) => path.replace(/^\/api/, ""), // 路径重写（移除/api前缀）
      },
    },
  },
  plugins: [
    vue(),

    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],

      // dts: path.resolve(pathSrc, "auto-imports.d.ts"),
    }),

    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep",'material-symbols'],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],

      // dts: path.resolve(pathSrc, "components.d.ts"),
    }),

    Icons({
      autoInstall: true,
    }),

    VueSetupExtend(),
  ],
});
