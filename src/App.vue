<script setup>
// import Mbyf from './views/1-mbyf.vue'
// import Xysjc from './views/2-xysjc.vue';
// import Form from "./views/3-form.vue";
</script>

<template>
  <!-- <Mbyf msg="Vite + Vue" /> -->
  <!-- <Xysjc msg="Vite + Vue" /> -->
  <!-- <Form msg="Vite + Vue" /> -->

  <div id="app">
    <!-- 导航链接 -->
    <nav>
      <router-link to="/" class="nav-link">模版语法</router-link>
      <router-link to="/Reactivity" class="nav-link">响应式基础</router-link>
      <router-link to="/FormBinding" class="nav-link">表单绑定</router-link>
      <router-link to="/Watchers" class="nav-link">侦听器</router-link>
      <router-link to="/Demo" class="nav-link">案例</router-link>
    </nav>

    <!-- 路由出口：匹配的组件将在这里渲染 -->
    <router-view />
  </div>
</template>

<style scoped>
nav {
  height: 60px;
  background-color: #545c64;
  /* 粘性定位，滚动到顶部时固定 */
  position: sticky;
  top: 0;
  display: flex;
  gap: 40px;
  padding: 0 20px;
}
.nav-link {
  color: #fff;
  font-size: 18px;
  line-height: 60px;
}
.nav-link:active,
.nav-link:hover {
  color: #ffd04b;
}
/* 路由激活状态 */
.router-link-active {
  color: #ffd04b;
  border-bottom: 2px solid #ffd04b;
}
</style>
