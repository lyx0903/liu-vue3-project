/*
路由模式：
createWebHistory()：使用 HTML5 历史模式（无 hash 符号 #）
createWebHashHistory()：使用 hash 模式（URL 中带 #）
*/
import { createRouter, createWebHistory } from "vue-router";
// 按需导入需要的图标
// import { Document, User, Setting, Menu } from "@element-plus/icons-vue";

// 导入组件
// import Home from '../views/Home.vue'
// import About from '../views/About.vue'
import TemplateSyntax from "../views/TemplateSyntax.vue";
import Reactivity from "../views/Reactivity.vue";
import FormBinding from "../views/FormBinding.vue";
import Watchers from "../views/Watchers.vue";
import Demo from "../views/Demo.vue";
import TemplateUse from "../views/templateUse/index.vue";
import Component from "../views/component/index.vue";
import ComUse from "../views/comUse/index.vue";
import ClassList from "../views/demos/classList/index.vue";
import Users from "../views/demos/users/users.vue";
import Model from "../views/demos/model/index.vue";
import FormAuto from "../views/formAuto/FormAuto.vue";
import DynamicFormTable from "../views/formAuto/DynamicFormTable.vue";

// 路由规则
const routes = [
  {
    path: "/", // 路由路径
    name: "模板语法", // 路由名称
    component: TemplateSyntax, // 对应的组件
    meta: {
      icon: 'Document', // 用markRaw标记，避免响应式追踪
    }, // 可自定义额外信息
  },
  {
    path: "/Reactivity",
    name: "响应式基础",
    component: Reactivity,
    meta: {
      icon: "User",
    },
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
  {
    path: "/Demo",
    name: "案例",
    component: Demo,
  },
  {
    path: "/TemplateUse",
    name: "模板引用",
    component: TemplateUse,
  },
  {
    path: "/Component",
    name: "组件基础",
    component: Component,
  },
  {
    path: "/ComUse",
    name: "增删改查",
    component: ComUse,
  },
  {
    path: "/ClassList",
    name: "班级列表",
    component: ClassList,
  },
  {
    path: "/Users",
    name: "用户管理",
    component: Users,
  },
  {
    path: "/Model",
    name: "3D模型",
    component: Model,
  },
  {
    path: "/FormAuto",
    name: "动态表单",
    component: FormAuto,
  },
  {
    path: "/DynamicFormTable",
    name: "动态表格",
    component: DynamicFormTable,
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

// 【 icon使用 】
// 当 icon 全局引用时，才能路由配置中直接使用，

// 如果是局部引用，需要使用 markRaw ，避免图标被渲染成响应式
// import { markRaw } from "vue";

// meta: {
//   icon: markRaw(Document), // 用markRaw标记，避免响应式追踪
// }, // 可自定义额外信息
