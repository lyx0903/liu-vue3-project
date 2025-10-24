<template>
  <el-dialog
    v-model="addDialogObj.show"
    :title="addDialogObj.title"
    :width="addDialogObj.width"
  >
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogObj.show = false">Cancel</el-button>
        <el-button type="primary" @click="addDialogObj.show = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const addDialogObj = reactive({
  show: false,
  title: "新增",
  width: 500,
});

// const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

// 暴露给父组件的属性和方法
defineExpose({ addDialogObj });
</script>
