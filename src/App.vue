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
            <!-- 递归渲染菜单 -->
            <template v-for="(item, index) in routerList" :key="index">
              <!-- 有子菜单的情况 -->
              <el-sub-menu
                v-if="item.children && item.children.length > 0"
                :index="item.path"
              >
                <template #title>
                  <el-icon v-if="item.meta?.icon">
                    <component :is="item.meta.icon" />
                  </el-icon>
                  <span>{{ item.name }}</span>
                </template>
                <!-- 渲染子菜单 -->
                <el-menu-item
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  :index="item.path + '/' + child.path"
                >
                  {{ child.name }}
                </el-menu-item>
              </el-sub-menu>
              <!-- 无子菜单的情况 -->
              <el-menu-item
                v-else
                :index="item.path"
                class="nav-link"
              >
                <el-icon v-if="item.meta?.icon">
                  <component :is="item.meta.icon" />
                </el-icon>
                {{ item.name }}
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <!-- 路由出口：匹配的组件将在这里渲染 -->
            <router-view />
          </el-main>
          <!-- <el-footer>Footer</el-footer> -->
        </el-container>
      </el-container>
      <!-- </el-container> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { routes } from "./router";

// 直接使用原始路由配置数组
const routerList = ref(routes);
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
