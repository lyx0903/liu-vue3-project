import { defineConfig } from "vite"; // 导入 Vite 的配置函数
import vue from "@vitejs/plugin-vue"; // 导入 Vite 的 Vue 插件，用于支持 Vue 单文件组件
import path from "path"; // 导入 Node.js 的 path 模块，用于处理文件路径
import VueSetupExtend from "vite-plugin-vue-setup-extend"; // 导入 Vue 增强插件，允许在 setup 语法糖中直接设置组件名

// 导入图标相关插件
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite"; // 导入自动导入插件，用于自动导入 API 和组件

import Components from "unplugin-vue-components/vite"; // 导入组件自动注册插件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // 导入 Element Plus 解析器，用于自动导入 Element Plus 组件

// Vite 配置导出
// https://vite.dev/config/ 可以查看完整配置选项文档
export default defineConfig({
  // 路径解析配置
  resolve: {
    // 配置路径别名（@指向 src 目录），代码中可以使用 @ 代替 ./src
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
    port: 3000, // 端口号，默认为 5173，这里改为 3000
    host: "localhost", // 主机地址，默认为 'localhost'，设为 '0.0.0.0' 可允许外部设备访问

    proxy: {
      // 代理配置（解决跨域，地址和端口号有一个不一样就是跨域）
      // 将所有/api开头的请求代理到http://localhost:8081
      "/api": {
        target: "http://localhost:8081", // 目标服务器地址（后端API地址）
        changeOrigin: true, // 改变请求源，开启跨域，将请求头中的 origin 改为目标服务器地
        rewrite: (path) => path.replace(/^\/api/, ""), // 路径重写（移除/api前缀）
      },
    },
  },

  // 插件配置
  plugins: [
    vue(), // 启用 Vue 插件，使 Vite 支持 Vue 单文件组件
    VueSetupExtend(), // 启用 Vue setup 增强插件，允许在 <script setup> 中使用 name 属性设置组件名

    // 自动导入插件配置
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等，无需手动 import 即可在组件中使用
      imports: ["vue"],

      // 解析器配置，用于自动导入其他库的 API
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),

        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon", // 图标组件的前缀，例如 IconEpHome
        }),
      ],

      // 可选配置：指定自动生成的类型声明文件路径
      // dts: path.resolve(pathSrc, "auto-imports.d.ts"),
    }),

    // 组件自动注册插件配置
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep", "material-symbols"], // 指定启用的图标集合，ep 是 Element Plus 图标，material-symbols 是 Material 图标
        }),
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],

      // dts: path.resolve(pathSrc, "components.d.ts"),
    }),

    // 图标插件配置
    Icons({
      autoInstall: true, // 自动安装缺失的图标集
    }),
  ],
});
