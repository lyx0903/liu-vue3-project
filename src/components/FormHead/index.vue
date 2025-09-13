<template>
  <div class="form-head" :style="`border: 1px solid ${props.borderColor}`">
    <div class="forms">
      <slot name="forms"></slot>
    </div>
    <div class="btns">
      <slot name="btns"></slot>
    </div>
  </div>
</template>

<script setup>
// props 接收父组件传递的 borderColor
const props = defineProps({
  borderColor: {
    type: String,
    default: "#ddd", // 字符串默认值
  },
});
</script>

<style scoped>
.form-head {
  display: flex;
  border-radius: 5px;
  gap: 20px;
  padding: 15px;
}
.forms {
  flex: 1;
}
.btns {
  width: 200px;
  text-align: right;
}
.form-head >>> .el-form .el-form-item {
  margin-bottom: 0;
}
</style>
