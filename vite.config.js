import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueSetupExtend from "vite-plugin-vue-setup-extend";


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
  plugins: [vue(),VueSetupExtend()],
});
