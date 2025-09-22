<template>
  <el-dialog v-model="dialogObj.show" :title="dialogObj.title" width="500">
    <el-form model="dialogForm">
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
      <el-form-item>
        <el-button type="info" plain>取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import axios from "axios";
import { reactive } from "vue";

const formLabelWidth = "80px";

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
});

const submit = () => {
  axios
    .post("/api/users", { ...dialogForm })
    .then(function (res) {
      // console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // 总是会执行
    });
};

// 暴露子组件的属性给父组件（关键！否则父组件无法访问 dialogObj)
defineExpose({
  dialogObj, // 将 dialogObj 暴露出去，父组件可通过 dialogRef.value.dialogObj 访问
});
</script>

<style scoped></style>
