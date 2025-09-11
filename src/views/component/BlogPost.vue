<template>
  <div>{{ props.message }}</div>
  <div>{{ code }}</div>
  <button @click="btnClick"></button>
</template>

<script setup>
import { onMounted, ref } from "vue";
const props = defineProps(["message", "code"]);
const message = ref("msg");

const emits = defineEmits(["gun"]);
const btnClick = () => {
  emits("gun", 88);
};
onMounted(() => {
  console.log(props.message);
});
</script>
