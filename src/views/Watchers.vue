<template>
  <h2>监视ref定义的【基本类型】数据</h2>
  <h2>当前求和为：{{ sum }}</h2>
  <button @click="changeSum">点我sum+1</button>
</template>

<script setup>
import { ref, watch } from "vue";

const sum = ref(0);
const changeSum = () => {
  sum.value += 1;
};

watch(sum,(newVal,oldVal)=>{
console.log(`新：${newVal}，旧${oldVal}`);

},
{deep:true})

</script>

<style lang="scss" scoped></style>
