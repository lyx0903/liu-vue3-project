<template>
  <el-card shadow="never">
    <h2>监视ref定义的【基本类型】数据</h2>
    <div class="cont">
      <div class="text">当前求和为：{{ sum }}</div>
      <el-button type="primary" @click="changeSum">点我sum+1</el-button>
    </div>
  </el-card>
  <el-card shadow="never">
    <h2>监视ref定义的【对象类型】数据</h2>
    <div class="cont">
      <div class="text">姓名：{{ person.name }}</div>
      <div class="text">年龄：{{ person.age }}</div>
      <el-button type="primary" @click="changeName">改名字</el-button>
      <el-button type="primary" @click="changeAge">改年龄</el-button>
      <el-button type="primary" @click="changePerson"
        >改整个人（对象）</el-button
      >
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch } from "vue";

const sum = ref(0);
const changeSum = () => {
  sum.value += 1;
};
watch(sum, (newVal, oldVal) => {
  console.log(`新：${newVal}，旧${oldVal}`);
});

const person = ref({
  name: "张三",
  age: 18,
});
const changeName = () => {
  person.value.name += "~";
};
const changeAge = () => {
  person.value.age += 1;
};
const changePerson = () => {
  person.value = {
    name: "lisi",
    age: 80,
  };
};
watch(
  person,
  (newValue, oldValue) => {
    console.log(`新：${newValue}，旧${oldValue}`);
  },
  { deep: true } //开启深度监听可以监听到对象属性的变化
);
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;

  h2 {
    margin: 0;
    margin-bottom: 15px;
    font-size: 18px;
  }
  .text {
    margin-bottom: 10px;
  }
}
</style>
