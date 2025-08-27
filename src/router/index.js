/*
路由模式：
createWebHistory()：使用 HTML5 历史模式（无 hash 符号 #）
createWebHashHistory()：使用 hash 模式（URL 中带 #）
*/
import { createRouter, createWebHistory } from "vue-router";

// 导入组件
// import Home from '../views/Home.vue'
// import About from '../views/About.vue'
import Mbyf from "../views/1-mbyf.vue";
import Xysjc from '../views/2-xysjc.vue';
import Form from "../views/3-form.vue";

// 路由规则
const routes = [
  {
    path: "/",
    name: "模板语法",
    component: Mbyf,
  },
  {
    path: "/Xysjc",
    name: "响应式基础",
    component: Xysjc,
  },
  {
    path: "/Form",
    name: "表单绑定",
    component: Form,
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
  routes,
});

export default router;
