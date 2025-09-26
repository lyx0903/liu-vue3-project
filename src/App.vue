<template>
  <div id="app">
    <div class="common-layout">
      <!-- <el-container> -->
      <!-- <el-header>Header</el-header> -->
      <el-container>
        <el-aside width="200px">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            router
          >
            <!-- 
            router--启用菜单路由模式 
            :index--结合 el-menu 的 router 属性使用时，index 的值会被作为路由路径
            -->
            <el-menu-item
              :index="item.path"
              class="nav-link"
              v-for="(item, index) in routerList"
              :key="index"
            >
              <!--  
                条件渲染：如果路由项配置了图标，则显示图标 
                动态组件：根据item.meta.icon的值渲染渲染对应的图标组件  :is="组件名" 是Vue中动态渲染组件的语法
                :is 接收的组件可能被 Vue 处理为响应式对象
                如果 item.meta.icon 对应的是 Element Plus 的图标组件，而这些组件在导入或存储时被意外地变成了响应式对象（例如用 ref 或 reactive 包裹），就会触发警告。 -->
              <el-icon v-if="item.meta?.icon">
                <component :is="item.meta.icon" />
              </el-icon>
              {{ item.name }}</el-menu-item
            >
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <!-- 路由出口：匹配的组件将在这里渲染 -->
            <router-view
          /></el-main>
          <!-- <el-footer>Footer</el-footer> -->
        </el-container>
      </el-container>
      <!-- </el-container> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import router from "./router";

const routerList = ref([]);

onMounted(() => {
  routerList.value = router.getRoutes(); // 通过路由实例获取所有路由配置
});
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100vh;
  overflow-y: auto;
}
.el-menu-item {
  height: 40px;
}
</style>
