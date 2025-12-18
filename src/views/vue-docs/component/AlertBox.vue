<template>
  <div class="alert-box">
    <H3>This is an Error for Demo Purposes</H3>
    <!-- 占位符，接收父组件传递的内容 -->
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.alert-box {
  color: #666;
  border: 1px solid red;
  border-radius: 4px;
  padding: 20px;
  background-color: #f8f8f8;
}
h3 {
  color: red;
}
</style>
