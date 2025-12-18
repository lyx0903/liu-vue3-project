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
        <el-button
          type="danger"
          :disabled="multipleSelection.length === 0"
          @click="batchDelete"
          >批量删除</el-button
        >
      </template>
    </Btns>
    <div class="user-table">
      <el-table
        :data="tableData"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" width="100" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === 'enable'
                  ? 'success'
                  : scope.row.status === 'disable'
                  ? 'danger'
                  : 'info'
              "
            >
              {{
                scope.row.status === "enable"
                  ? "启用"
                  : scope.row.status === "disable"
                  ? "禁用"
                  : "-"
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.role === 'admin'
                  ? 'primary'
                  : scope.row.role === 'editor'
                  ? 'warning'
                  : 'info'
              "
            >
              {{
                scope.row.role === "admin"
                  ? "管理员"
                  : scope.row.role === "editor"
                  ? "编辑"
                  : "普通用户"
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              :text="true"
              @click="openDialog('编辑', scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              :text="true"
              @click="deleteRow(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog ref="dialogRef" @addOk="addOk"></Dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, useTemplateRef, nextTick } from "vue";
import axios from "axios";
import Btns from "./Btns.vue";
import Dialog from "./Dialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

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
// 删除行
const deleteRow = async (id) => {
  try {
    const isDelete = await ElMessageBox.confirm("确定要删除该数据吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (isDelete) {
      await axios.delete(`/api/users/${id}`);
      ElMessage({ type: "success", message: "删除成功" });
      getUsersList();
    }
  } catch (error) {
    ElMessage({ type: "info", message: "已取消" });
  }
};

// 批量删除
const multipleSelection = ref([]); //多选数据
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
const batchDelete = async () => {
  try {
    const isDelete = await ElMessageBox.confirm("确定删除吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (isDelete) {
      for (const item of multipleSelection.value) {
        await axios.delete(`/api/users/${item.id}`);
      }
      ElMessage({ type: "success", message: "删除成功" });
      getUsersList();
    }
  } catch (error) {
    ElMessage({ type: "info", message: "已取消" });
  }
};

// 获取列表--请求接口
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

// 重置 -- 模板中要有 prop 才能重置成功， prop 的 value 与绑定对象的 key 一致
const formInlineRef = useTemplateRef("formInlineRef");

const reset = () => {
  formInlineRef.value.resetFields();
  getUsersList();
};

// 打开弹窗
const dialogRef = useTemplateRef("dialogRef");

const openDialog = async (flag, row) => {
  dialogRef.value.dialogObj.show = true; //打开
  dialogRef.value.dialogObj.title = flag; //标题赋值

  // DOM 未更新
  await nextTick();
  // DOM 此时已经更新

  //重置
  dialogRef.value.resetForm();

  if (flag === "新增") {
  } else if (flag === "编辑") {
    // let editObj = { ...row };
    // dialogRef.value.dialogForm = { ...row };
    // debugger
    // console.log(row);
    Object.assign(dialogRef.value.dialogForm, row); //数据回显
    // console.log("赋值后的数据:", dialogRef.value.dialogForm);
  }
};

// 弹窗新增成功传递的 emit 事件，父组件刷新列表
const addOk = () => {
  getUsersList();
};
</script>

<style scoped>
.el-select {
  --el-select-width: 220px;
}
</style>
