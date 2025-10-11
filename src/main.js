import { createApp } from "vue"; // 从 Vue 框架中导入 createApp 函数，用于创建 Vue 应用实例
import "./style.css"; // 导入全局样式文件，该文件中的样式会应用于整个应用
// import ElementPlus from "element-plus";// 导入 Element Plus 组件库
// import "element-plus/dist/index.css";// 导入 Element Plus 全局样式文件
import App from "./App.vue"; // 导入应用的根组件 App（整个应用的入口组件）
import router from "./router"; // 导入路由配置实例，用于实现单页应用的路由功能
import FormHead from "@/components/FormHead/index.vue"; // 导入自定义全局组件 FormHead（从指定路径引入）

// import * as ElementPlusIconsVue from "@element-plus/icons-vue"; // 导入所有 Element Plus 图标

const app = createApp(App); // 创建 Vue 应用实例，并将根组件 App 作为参数传入

// 应用实例会暴露一个 .config 对象允许我们配置一些应用级的选项
// app.config.errorHandler = (err) => {
//   /* 处理错误 */
// }

// 全局注册所有 element Plus 图标
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }

// 注册一个组件（全局组件,页面中无需引入，直接使用）
app.component("FormHead", FormHead);

// 挂在路由和ElementPlus
app.use(router);
// app.use(ElementPlus);
// 应用实例必须在调用了 .mount() 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串
app.mount("#app");

// 多个应用实例
// 应用实例并不只限于一个。createApp API 允许你在同一个页面中创建多个共存的 Vue 应用，而且每个应用都拥有自己的用于配置和全局资源的作用域。
// const app1 = createApp({
//   /* ... */
// })
// app1.mount('#container-1')
