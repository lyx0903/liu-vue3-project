import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router"; // 引入路由配置
import FormHead from "@/components/FormHead/index.vue"; //引入全局组件

const app = createApp(App);

// 应用实例会暴露一个 .config 对象允许我们配置一些应用级的选项
// app.config.errorHandler = (err) => {
//   /* 处理错误 */
// }

// 注册一个组件（全局组件,页面中无需引入，直接使用）
app.component("FormHead", FormHead);

app.use(router);
app.use(ElementPlus);
// 应用实例必须在调用了 .mount() 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串
app.mount("#app");

// 多个应用实例
// 应用实例并不只限于一个。createApp API 允许你在同一个页面中创建多个共存的 Vue 应用，而且每个应用都拥有自己的用于配置和全局资源的作用域。
// const app1 = createApp({
//   /* ... */
// })
// app1.mount('#container-1')
