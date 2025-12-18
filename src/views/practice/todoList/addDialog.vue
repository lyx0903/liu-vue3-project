<template>
  <el-dialog
    v-model="addDialogObj.show"
    :title="addDialogObj.title"
    :width="addDialogObj.width"
  >
    <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
      <template
        v-if="addDialogObj.title === '新增' || addDialogObj.title === '修改'"
      >
        <el-form-item label="平台" prop="platform">
          <el-input v-model="form.platform" autocomplete="off" />
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-input v-model="form.module" autocomplete="off" />
        </el-form-item>
        <el-form-item label="功能" prop="feature">
          <el-input v-model="form.feature" autocomplete="off" />
        </el-form-item>
        <el-form-item label="工作量" prop="workload">
          <el-input v-model="form.workload" autocomplete="off" />
        </el-form-item>
        <el-form-item label="负责人" prop="proposer">
          <el-input v-model="form.proposer" autocomplete="off" />
        </el-form-item>
        <el-form-item label="前端" prop="frontend">
          <el-input v-model="form.frontend" autocomplete="off" />
        </el-form-item>
        <el-form-item label="后端" prop="backend">
          <el-input v-model="form.backend" autocomplete="off" />
        </el-form-item>
      </template>

      <template v-if="addDialogObj.title === '状态变更'">
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="待开发" value="待开发" />
            <el-option label="开发中" value="开发中" />
            <el-option label="待评审" value="待评审" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogObj.show = false">取消</el-button>
        <el-button type="primary" @click="save"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, useTemplateRef } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const formRef = useTemplateRef("formRef");

const addDialogObj = reactive({
  show: false,
  title: "新增",
  width: 500,
});

// const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

const form = reactive({
  platform: "",
  module: "",
  feature: "",
  status: "",
  proposer: "",
  frontend: "",
  backend: "",
  workload: "",
  id: "",
});

const rules = reactive({
  platform: [{ required: true, message: "请输入", trigger: "blur" }],
  module: [{ required: true, message: "请输入", trigger: "blur" }],
  feature: [{ required: true, message: "请输入", trigger: "blur" }],
  status: [{ required: true, message: "请输入", trigger: "blur" }],
  proposer: [{ required: true, message: "请输入", trigger: "blur" }],
  frontend: [{ required: true, message: "请输入", trigger: "blur" }],
  backend: [{ required: true, message: "请输入", trigger: "blur" }],
  workload: [{ required: true, message: "请输入", trigger: "blur" }],
});

const time =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
const emits = defineEmits(["addok"]);

const save = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    if (addDialogObj.title === "新增") {
      axios
        .post("api/todolist", { ...form, proposalDate: time, status: "待开发" })
        .then((res) => {
          console.log(res.data);
          emits("addok"); //成功事件返回emit
          ElMessage({ type: "success", message: "操作成功" });
          addDialogObj.show = false;
          const newId = res.data.id;
          // console.log(newId);
        })
        .catch(function (error) {
          // 处理错误情况
          console.log(error);
        })
        .finally(function () {
          // 总是会执行
        });
    } else if (
      addDialogObj.title === "状态变更" ||
      addDialogObj.title === "修改"
    ) {
      axios
        .put(`api/todolist/${form.id}`, { ...form, status: form.status })
        .then((res) => {
          console.log(res.data);
          emits("addok"); //成功事件返回emit
          ElMessage({ type: "success", message: "操作成功" });
          addDialogObj.show = false;
        })
        .catch(function (error) {
          // 处理错误情况
          console.log(error);
        })
        .finally(function () {
          // 总是会执行
        });
    }
  } else {
  }
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 暴露给父组件的属性和方法
defineExpose({ addDialogObj, form, resetForm });
</script>
