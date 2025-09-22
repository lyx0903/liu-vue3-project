<template>
  <div class="wrap">
    <el-form :inline="true" :model="formInline" ref="formInlineRef">
      <el-form-item label="角色" prop="role">
        <el-select v-model="formInline.role">
          <el-option label="管理员" value="admin" />
          <el-option label="编辑" value="editor" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formInline.status">
          <el-option label="启用" value="enable" />
          <el-option label="禁用" value="disable" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <Btns>
      <template #btns>
        <el-button type="primary" @click="openDialog('新增')">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </template>
    </Btns>
    <div class="user-table">
      <el-table :data="tableData">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 'enable' ? 'success' : 'danger'"
            >
              {{ scope.row.status === "enable" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.role === 'admin'
                  ? 'primary'
                  : scope.row.role === 'user'
                  ? 'warning'
                  : 'info'
              "
            >
              {{
                scope.row.role === "admin"
                  ? "管理员"
                  : scope.row.role === "user"
                  ? "普通用户"
                  : "编辑"
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column>
          <template #default>
            <el-button type="primary" plain>编辑</el-button>
            <el-button type="danger" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog ref="dialogRef"></Dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, useTemplateRef } from "vue";
import axios from "axios";
import Btns from "./Btns.vue";
import Dialog from "./Dialog.vue";

onMounted(() => {
  getUsersList();
});

// 查询条件
const formInline = reactive({
  role: "",
  status: "",
});

// 表格
const tableData = ref([]); //动态数据

// 获取列表
function getUsersList() {
  axios
    .get("/api/users", { params: formInline })
    .then(function (res) {
      tableData.value = res.data; //请求成功，数据赋值给表格
      // console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // 总是会执行
    });
}

// 查询
const query = () => {
  getUsersList();
};

// 重置 -- 模板中要有 prop 才能重置成功
const formInlineRef = useTemplateRef("formInlineRef");

const reset = () => {
  formInlineRef.value.resetFields();
  getUsersList();
};

// 打开弹窗
const dialogRef = useTemplateRef("dialogRef");
// console.log(2, dialogRef.value);

const openDialog = (flag,row) => {
  dialogRef.value.dialogObj.show = true;
  dialogRef.value.dialogObj.title = flag;
};
</script>

<style scoped>
.el-select {
  --el-select-width: 220px;
}
</style>
