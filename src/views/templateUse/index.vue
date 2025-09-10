<template>
  <div class="wrap">
    <!-- 访问模板引用（你只可以在组件挂载后才能访问模板引用，挂载前是 null） -->
    <h1 ref="h1Ref">12345</h1>
    <button @click="getDom">你好</button>
    <!-- 组件上的 ref -->
    <B ref="bRef"></B>
    <button @click="getBData">B</button>

    <div>woshineirong</div>
    
  </div>
</template>

<script setup>
import { useTemplateRef, onMounted, ref } from "vue";
import B from "./B.vue";
const h1Ref = useTemplateRef("h1Ref");
const getDom = () => {
  console.log(h1Ref.value);
  h1Ref.value.style.color = "red";
};
const bRef = useTemplateRef("bRef");
const getBData = () => {
  console.log(bRef.value.a);
  bRef.value.a = 6
  bRef.value.c()
};
</script>
