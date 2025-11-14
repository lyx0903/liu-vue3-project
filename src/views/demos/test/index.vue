<template>
  <div class="app">
    <!-- <Header /> -->
    <Card />
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import Card from "./Card.vue";
</script>
<style lang="scss" scoped>
.app {
  background: linear-gradient(135deg, #0c1e3a 0%, #14294a 100%);
  height: calc(100vh - 60px);
  overflow: hidden;
}
</style>
