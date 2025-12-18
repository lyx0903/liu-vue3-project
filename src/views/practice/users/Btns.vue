<template>
  <div class="container">
    <div class="btns">
      <slot name="btns"></slot>
    </div>
    <div class="msg">
      <slot name="msg"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}
.btns {
  flex:1
}
</style>
