<template>
  <div class="btns">
    <div class="btn">
      <slot name="btn"></slot>
    </div>
    <div class="message">
      <slot name="message"></slot>
      <template v-for="item in props.countList">
        <span style="margin-left: 20px">
          {{ item.label }}：
          <el-tag class="title" :type="item.type"> {{ item.value }} </el-tag>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  countList: {
    type: Array,
    default: [],
  },
});

// const source = ref(0);
// const outputValue = useTransition(source, {
//   duration: 1500,
// });
// source.value = 172000;
</script>

<style scoped>
.btns {
  margin: 20px 0;
  display: flex;
  gap: 20px;
}
.message {
  flex: 1;
  /* text-align: right; */
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 5px;
  cursor: pointer;
}
</style>
