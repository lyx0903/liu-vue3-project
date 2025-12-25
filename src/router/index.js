/*
路由模式：
createWebHistory()：使用 HTML5 历史模式（无 hash 符号 #）
createWebHashHistory()：使用 hash 模式（URL 中带 #）
*/
import { createRouter, createWebHistory } from "vue-router";
// 按需导入需要的图标
// import { Document, User, Setting, Menu } from "@element-plus/icons-vue";

// 导入组件
import Home from "../views/Home.vue";
// import About from '../views/About.vue'
import TemplateSyntax from "../views/vue-docs/template.vue";
import Reactivity from "../views/vue-docs/reactivity.vue";
import FormBinding from "../views/vue-docs/form-binding.vue";
import Watchers from "../views/vue-docs/watchers.vue";
import Charts from "../views/practice/charts.vue";
import Demo from "../views/practice/demo.vue";
import TemplateUse from "../views/vue-docs/templateUse/index.vue";
import Component from "../views/vue-docs/component/index.vue";
import ComUse from "../views/practice/comUse/index.vue";
import ClassList from "../views/practice/classList/index.vue";
import Users from "../views/practice/users/users.vue";
import Model from "../views/practice/model/index.vue";
import FormAuto from "../views/practice/formAuto/index.vue";
import Tree from "../views/practice/tree/index.vue";
import ToDoList from "../views/practice/todoList/index.vue";
import Test from "../views/zfh/test/index.vue";
import Card from "../views/practice/card/index.vue";
import Zfhbsy from "../views/zfh/zfhbjgxt/index.vue";
import Qxgl from "../views/zfh/zfhbjgxt/qxgl.vue";
// 导入日常工作相关组件
import DailyWorkOverview from "../views/dailyWork/overview.vue";
import DailyWorkReport from "../views/dailyWork/dailyReport.vue";
import DailyWorkSummary from "../views/dailyWork/summary.vue";
import DailyWorkAttendance from "../views/dailyWork/attendance/index.vue";


// 路由规则
const routes = [
  // 首页
  {
    path: "/home",
    name: "首页",
    component: Home,
    meta: {
      icon: "House",
    },
  },

  // 实战演练菜单
  {
    path: "/practice",
    name: "实战演练",
    meta: {
      icon: "Star",
    },
    children: [
      {
        path: "demo",
        name: "案例",
        component: Demo,
      },
      {
        path: "comUse",
        name: "增删改查",
        component: ComUse,
      },
      {
        path: "classList",
        name: "班级列表",
        component: ClassList,
      },
      {
        path: "users",
        name: "用户管理",
        component: Users,
      },
      {
        path: "model",
        name: "3D模型",
        component: Model,
      },
      {
        path: "formAuto",
        name: "动态表单",
        component: FormAuto,
      },
      {
        path: "tree",
        name: "树形",
        component: Tree,
      },
      {
        path: "todoList",
        name: "需求清单",
        component: ToDoList,
      },
      {
        path: "card",
        name: "B端组件测试",
        component: Card,
      },
      {
        path: "charts",
        name: "图表",
        component: Charts,
      },
    ],
  },
  // Vue文档学习菜单
  {
    path: "/vue-docs",
    name: "Vue文档学习",
    meta: {
      icon: "Reading",
    },
    children: [
      {
        path: "template",
        name: "模板语法",
        component: TemplateSyntax,
      },
      {
        path: "reactivity",
        name: "响应式基础",
        component: Reactivity,
      },
      {
        path: "form-binding",
        name: "表单绑定",
        component: FormBinding,
      },
      {
        path: "watchers",
        name: "侦听器",
        component: Watchers,
      },
      {
        path: "component",
        name: "组件基础",
        component: Component,
      },
      {
        path: "template-use",
        name: "模板引用",
        component: TemplateUse,
      },
    ],
  },
  // 尊峰环保菜单
  {
    path: "/zfh",
    name: "尊峰环保",
    meta: {
      icon: "OfficeBuilding",
    },
    children: [
      {
        path: "test",
        name: "测试",
        component: Test,
      },
      {
        path: "zfhbsy",
        name: "首页2",
        component: Zfhbsy,
      },
      {
        path: "qxgl",
        name: "权限管理",
        component: Qxgl,
      },
    ],
  },
  // 日常工作菜单
  {
    path: "/dailyWork",
    name: "日常工作",
    meta: {
      icon: "Calendar",
    },
    // 子菜单
    children: [
      {
        path: "overview",
        name: "工作总览",
        component: DailyWorkOverview,
      },
      {
        path: "attendance/index",
        name: "考勤",
        component: DailyWorkAttendance,
      },
      {
        path: "dailyReport",
        name: "日报",
        component: DailyWorkReport,
      },
      {
        path: "summary",
        name: "总结",
        component: DailyWorkSummary,
      },
    ],
  },
  {
    path: "/",
    redirect: "/home",
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

export { routes }; // 导出原始路由配置数组

// 【 icon使用 】
// 当 icon 全局引用时，才能路由配置中直接使用，

// 如果是局部引用，需要使用 markRaw ，避免图标被渲染成响应式
// import { markRaw } from "vue";

// meta: {
//   icon: markRaw(Document), // 用markRaw标记，避免响应式追踪
// }, // 可自定义额外信息
