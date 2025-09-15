<template>
  <!-- <Mbyf msg="Vite + Vue" /> -->
  <!-- <Xysjc msg="Vite + Vue" /> -->
  <!-- <Form msg="Vite + Vue" /> -->

  <div id="app">
    <!-- 导航链接 -->
    <nav>
      <router-link
        :to="item.path"
        class="nav-link"
        v-for="(item, index) in routerList"
        :key="index"
        >{{ item.name }}</router-link
      >
      <!-- <router-link to="/Reactivity" class="nav-link">响应式基础</router-link>
      <router-link to="/FormBinding" class="nav-link">表单绑定</router-link>
      <router-link to="/Watchers" class="nav-link">侦听器</router-link>
      <router-link to="/Demo" class="nav-link">案例</router-link>
      <router-link to="/TemplateUse" class="nav-link">模板引用</router-link>
      <router-link to="/Component" class="nav-link">组件基础</router-link> -->
    </nav>

    <!-- 路由出口：匹配的组件将在这里渲染 -->
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import router from "./router";

const routerList = ref([]);

onMounted(() => {
  routerList.value = router.getRoutes();
});
</script>

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
  z-index: 10;
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
