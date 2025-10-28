<template>
  <div class="search-box">
    <el-form
      :inline="true"
      :model="searchForm"
      class="demo-form-inline"
      ref="searchFormRef"
    >
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="状态" clearable>
          <el-option
            v-for="(item, index) in demandStatus"
            :key="index"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提出日期" prop="proposalDate">
        <el-date-picker
          v-model="searchForm.proposalDate"
          type="date"
          placeholder="请选择"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="btns">
    <el-button type="primary" @click="openDialog('新增')">新增</el-button>
  </div>
  <div class="table">
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="platform" label="平台" />
      <el-table-column prop="module" label="模块" />
      <el-table-column prop="feature" label="功能" width="200" />
      <el-table-column prop="status" label="状态">
        <template #default="scope"> </template>
      </el-table-column>
      <el-table-column prop="proposer" label="负责人" />
      <el-table-column prop="frontend" label="前端" />
      <el-table-column prop="backend" label="后端" />
      <el-table-column prop="workload" label="工作量" />
      <el-table-column prop="proposalDate" label="提出日期" />

      <el-table-column
        prop="address"
        fixed="right"
        label="操作"
        min-width="200"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="openDialog('状态变更', scope.row)"
            >状态变更</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="openDialog('修改', scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteRow(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <addDialog ref="addDialogRef" @addok="addok"></addDialog>
</template>
<script setup>
import { onMounted, reactive, ref, useTemplateRef, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import addDialog from "./addDialog.vue";

// 页面初始化加载列表
onMounted(() => {
  getlist();
});

// 获取列表
const getlist = () => {
  axios({
    method: "get",
    url: "/api/todolist",
    params: { ...searchForm },
  })
    .then((res) => {
      console.log(res.data);
      tableData.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const searchForm = reactive({}); // 查询条件数据
const tableData = ref([]); // 表格数据
// 状态下拉框
const demandStatus = reactive([
  { label: "待评审", value: "待评审" },
  { label: "待开发", value: "待开发" },
  { label: "开发中", value: "开发中" },
  { label: "已完成", value: "已完成" },
]);

// 查询
const search = () => {
  getlist();
};
// 重置
const searchFormRef = useTemplateRef("searchFormRef");
const reset = () => {
  searchFormRef.value.resetFields();
  getlist();
};
// 删除
const deleteRow = (id) => {
  ElMessageBox.confirm("确认删除吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios.delete(`api/todolist/${id}`).then(() => {
        ElMessage({ type: "success", message: "取消" });
        getlist();
      });
    })
    .catch((action) => {
      ElMessage({
        type: "info",
        message: action === "cancel" ? "已取消" : "",
      });
    });
};

// 打开弹窗
const addDialogRef = useTemplateRef("addDialogRef");
const openDialog = async (flag, row) => {
  // console.log(addDialogRef.value.addDialogObj);

  addDialogRef.value.addDialogObj.show = true;
  addDialogRef.value.addDialogObj.title = flag;
  nextTick(() => {});
  addDialogRef.value.resetForm();
  if (flag === "新增") {
    delete addDialogRef.value.form.id;
  } else if (flag === "状态变更"||flag === "修改") {
    addDialogRef.value.form.id = row.id; // 回显 id（用于更新时定位数据）
    let editObj = { ...row,  };
    Object.assign(addDialogRef.value.form, editObj);
  }
};

// 表格状态
const tableRowClassName = ({ row }) => {
  if (row.status === "待开发") {
    return "warning-row";
  }
  return "";
};

const addok = () => {
  getlist();
};
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
    &:hover > td {
      background-color: var(--el-color-warning-light-8) !important;
    }
  }
}
// .el-table .success-row {
//   --el-table-tr-bg-color: var(--el-color-success-light-9);
// }
</style>
