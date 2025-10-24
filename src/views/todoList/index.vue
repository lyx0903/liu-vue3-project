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
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="proposer" label="负责人" />
      <el-table-column prop="frontend" label="前端" />
      <el-table-column prop="backend" label="后端" />
      <el-table-column prop="workload" label="工作量" />
      <el-table-column prop="proposalDate" label="提出日期" />
      <el-table-column prop="startDate" label="开始时间" />

      <el-table-column
        prop="address"
        fixed="right"
        label="操作"
        min-width="200"
      >
        <template #default>
          <el-button
            link
            type="primary"
            size="small"
            @click="openDialog('状态变更')"
            >状态</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="openDialog('修改')"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="openDialog('流转')"
            >流转</el-button
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
  <addDialog ref="addDialogRef"></addDialog>
</template>
<script setup>
import { onMounted, reactive, ref, useTemplateRef } from "vue";
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
  { label: "待验收", value: "待验收" },
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
  ElMessageBox.confirm("确认删除吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "取消",
      });
    })
    .catch((action) => {
      ElMessage({
        type: "info",
        message: action === "cancel" ? "已取消" : "",
      });
    });
  // try {
  // } catch (error) {
  //   ElMessage({ type: "info", message: "已取消" });
  // }
};

// 打开弹窗
const addDialogRef = useTemplateRef("addDialogRef");
const openDialog = async (flag, row) => {
  console.log(addDialogRef.value.addDialogObj);

  addDialogRef.value.addDialogObj.show = true;
  addDialogRef.value.addDialogObj.title = flag;
};

// 表格状态
const tableRowClassName = (row, rowIndex) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  --el-table-tr-bg-color: #ff0000;
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
