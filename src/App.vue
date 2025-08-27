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
      <router-link to="/">Mbyf</router-link> |
      <router-link to="/Xysjc">Xysjc</router-link> |
      <router-link to="/Form">Form</router-link>
    </nav>

    <!-- 路由出口：匹配的组件将在这里渲染 -->
    <router-view />
  </div>
</template>

<style scoped></style>
