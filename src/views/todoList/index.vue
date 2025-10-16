<template>
  <div class="search-box">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="状态" clearable>
          <el-option
            v-for="(item, index) in demandStatus"
            :key="index"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提出日期">
        <el-date-picker
          v-model="searchForm.date"
          type="date"
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <el-form-item label="需求类型">
        <el-select v-model="searchForm.type" placeholder="需求类型" clearable>
          <el-option
            v-for="(item, index) in demandType"
            :key="index"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="warning" @click="onSubmit">只看我的</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="btns">
    <el-button type="primary" @click="onSubmit">新增</el-button>
    <el-button type="primary" @click="onSubmit">优化</el-button>
    <el-button type="success" @click="onSubmit">导出</el-button>

    <!-- <el-input
      v-model="input2"
      style="width: 240px"
      placeholder="Please Input"
      :suffix-icon="Search"
    /> -->
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="pt" label="平台" />
      <el-table-column prop="mk" label="模块" />
      <el-table-column prop="gn" label="功能" />
      <el-table-column prop="xqlx" label="需求类型" />
      <el-table-column prop="xqmx" label="需求明细" />
      <el-table-column prop="zt" label="状态" />
      <el-table-column prop="tcr" label="提出人" />
      <el-table-column prop="fzr" label="负责人" />
      <el-table-column prop="qd" label="前端" />
      <el-table-column prop="hd" label="后端" />
      <el-table-column prop="qdgzl" label="前端工作量" />
      <el-table-column prop="hdgzl" label="后端工作量" />
      <el-table-column prop="tcrq" label="提出日期" />
      <el-table-column prop="fj" label="附件" />
      <el-table-column
        prop="address"
        fixed="right"
        label="操作"
        min-width="200"
      >
        <template #default>
          <el-button link type="primary" size="small">状态</el-button>
          <el-button link type="primary" size="small">修改</el-button>
          <el-button link type="primary" size="small">流转</el-button>
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";

const searchForm = reactive({
  status: "",
  date: "",
  type: "",
});

const demandStatus = reactive([
  { label: "待审批", value: "待审批" },
  { label: "待开发", value: "待开发" },
  { label: "开发中", value: "开发中" },
  { label: "待验收", value: "待验收" },
]);
const demandType = reactive([
  { label: "新增", value: "新增" },
  { label: "优化", value: "优化" },
]);

const onSubmit = () => {
  console.log("submit!");
};

const tableDataAll = ref([]);
const tableData = [
  {
    pt: "赤菟",
    mk: "需求",
    gn: "代办",
    xqlx: "新增",
    xqmx: "123",
    zt: "待开发",
    tcr: "张三",
    fzr: "李四",
    qd: "wangwu",
    hd: "zl",
    qdgzl: "2",
    hdgzl: "5",
    tcrq: "2025-10-10",
    fj: "",
  },
];

const input2 = ref("");
</script>

<style lang="scss" scoped></style>
