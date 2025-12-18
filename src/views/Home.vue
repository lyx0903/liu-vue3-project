<template>
  <div class="home-container">
    <h1 class="home-title">欢迎使用Vue 3项目</h1>
    <div class="home-content">
      <p>这是项目的首页，您可以通过左侧导航菜单访问各个功能模块。</p>
      <div class="home-features">
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <span>日常工作</span>
            </div>
          </template>
          <p>包含工作总览、日报和总结功能，帮助您高效管理日常工作。</p>
        </el-card>
        
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <span>Vue文档学习</span>
            </div>
          </template>
          <p>学习Vue 3的核心概念，包括模板语法、响应式基础、组件等内容。</p>
        </el-card>
        
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <span>实战演练</span>
            </div>
          </template>
          <p>通过实际案例学习Vue 3的实际应用，提升开发技能。</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页组件逻辑
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.home-title {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.home-content {
  max-width: 800px;
  margin: 0 auto;
}

.home-content p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
}

.home-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature-card {
  height: 100%;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}
</style>