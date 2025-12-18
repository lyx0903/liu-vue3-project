<template>
  <h2>我是子组件：B</h2>
  <div>{{ a }}</div>
</template>

<script setup>
import { useTemplateRef, onMounted, ref } from "vue";
const a = ref(0);
const b = 1;
const c = ()=>{
  alert('雄安可爱')
}
defineExpose({
  a,
  b,
  c
})
</script>
