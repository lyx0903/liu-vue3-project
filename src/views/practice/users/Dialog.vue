<template>
  <el-dialog v-model="dialogObj.show" :title="dialogObj.title" width="500">
    <el-form ref="dialogFormRef" :model="dialogForm" :rules="rules">
      <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
        <el-input v-model="dialogForm.id" />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dialogForm.name" />
      </el-form-item>
      <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="dialogForm.phone" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="dialogForm.email" />
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
        <el-select v-model="dialogForm.status">
          <el-option label="启用" value="enable" />
          <el-option label="禁用" value="disable" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
        <el-select v-model="dialogForm.role">
          <el-option label="管理员" value="admin" />
          <el-option label="编辑" value="editor" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="创建时间"
        :label-width="formLabelWidth"
        prop="createdAt"
      >
        <el-date-picker
          v-model="dialogForm.createdAt"
          type="date"
          :size="size"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain @click="dialogObj.show = false"
          >取消</el-button
        >
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { reactive, useTemplateRef } from "vue";

const formLabelWidth = "80px";
const dialogFormRef = useTemplateRef("dialogFormRef");

const dialogObj = reactive({
  show: false,
  title: "",
});

const dialogForm = reactive({
  id: null,
  name: "",
  phone: null,
  email: null,
  status: "",
  role: "",
  createdAt: "",
});

// 弹窗验证
const rules = reactive({
  id: [{ required: true, message: "请输入id", trigger: "blur" }],
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 5, message: "Length should be 2 to 5", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入有效的手机号",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "请输入有效的邮箱地址",
      trigger: "blur",
    },
  ],
});

// 提交
const emits = defineEmits(["addOk"]);
const submit = async () => {
  const valid = await dialogFormRef.value.validate();
  if (valid) {
    if (dialogObj.title === "新增") {
      axios
        .post("/api/users", { ...dialogForm })
        .then(function (res) {
          emits("addOk"); // 成功事件返回emit
          dialogObj.show = false;
          ElMessage({ type: "success", message: "添加成功" });
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          // 总是会执行
        });
    } else if (dialogObj.title === "编辑") {
      axios
        .put(`/api/users/${dialogForm.id}`, { ...dialogForm }) // url 和 发送到服务器的参数
        .then(function (res) {
          emits("addOk"); // 成功事件返回emit
          dialogObj.show = false;
          ElMessage({ type: "success", message: "修改成功" });
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          // 总是会执行
        });
    }
  } else {
    console.log("error submit!", fields);
  }
};

// 重置表单（form中需要添加 ref 属性，dialogFormRef是通过ref获取的表单组件引用 ）
const resetForm = () => {
  dialogFormRef.value.resetFields();
};

// 暴露子组件的属性给父组件（关键！否则父组件无法访问 dialogObj)
defineExpose({
  dialogObj, // 将 dialogObj 暴露出去，父组件可通过 dialogRef.value.dialogObj 访问
  dialogForm,
  resetForm,
});
</script>

<style scoped></style>
