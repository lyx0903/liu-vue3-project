/*
路由模式：
createWebHistory()：使用 HTML5 历史模式（无 hash 符号 #）
createWebHashHistory()：使用 hash 模式（URL 中带 #）
*/
import { createRouter, createWebHistory } from "vue-router";

// 导入组件
// import Home from '../views/Home.vue'
// import About from '../views/About.vue'
import TemplateSyntax from "../views/TemplateSyntax.vue";
import Reactivity from "../views/Reactivity.vue";
import FormBinding from "../views/FormBinding.vue";
import Watchers from "../views/Watchers.vue";

// 路由规则
const routes = [
  {
    path: "/", // 路由路径
    name: "模板语法", // 路由名称
    component: TemplateSyntax, // 对应的组件
  },
  {
    path: "/Reactivity",
    name: "响应式基础",
    component: Reactivity,
  },
  {
    path: "/FormBinding",
    name: "表单绑定",
    component: FormBinding,
  },
  {
    path: "/Watchers",
    name: "侦听器",
    component: Watchers,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About
  //   // 也可以使用懒加载
  //   // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 history 模式
  routes, // 传入上面定义的路由配置
});

export default router; // 导出路由实例
