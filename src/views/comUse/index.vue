<template>
  <div class="wrap">
    <FormHead borderColor="green">
      <template #forms>
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          ref="formRef"
        >
          <el-form-item label="班级编号" prop="classId">
            <el-input v-model="formInline.classId" clearable />
          </el-form-item>
          <el-form-item label="班级名称" prop="className">
            <el-input v-model="formInline.className" clearable />
          </el-form-item>
          <el-form-item label="类型" prop="classType">
            <el-select v-model="formInline.classType" clearable>
              <el-option label="实验班" value="实验班" />
              <el-option label="平行班" value="平行班" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #btns>
        <el-button type="primary" :icon="Search" @click="search"
          >查询</el-button
        >
        <el-button type="info" :icon="Refresh" @click="reset" plain
          >重置</el-button
        >
      </template>
    </FormHead>
    <Btns :countList="tongji">
      <template #btn>
        <el-button type="primary" :icon="Plus" @click="addAndEdit('新增')"
          >新增</el-button
        >
        <el-button type="danger" :icon="Delete">批量删除</el-button>
      </template>
    </Btns>
    <div class="table">
      <el-table :data="tableData">
        <el-table-column prop="classId" label="班级编号" width="100" />
        <el-table-column prop="className" label="名称" width="120" />
        <el-table-column prop="headTeacher" label="班主任" width="150">
          <template #default="scope">
            {{ scope.row.headTeacher.name }}（{{
              scope.row.headTeacher.subject
            }}-{{ scope.row.headTeacher.teachingExperience }}年）
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="学生数" width="100" />
        <el-table-column prop="establishDate" label="创建时间" width="120" />
        <el-table-column prop="classType" label="类型" width="100" />
        <el-table-column prop="averageScore" label="平均分" width="100" />
        <el-table-column prop="awards" label="荣誉" width="400" />
        <el-table-column prop="description" label="描述" width="500" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          min-width="120"
        >
          <template #default="scope">
            <el-button
              type="primary"
              :icon="Edit"
              plain
              circle
              @click="addAndEdit('编辑')"
            />
            <el-button
              type="danger"
              :icon="Delete"
              plain
              circle
              @click="deleteRow(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddDialog ref="addDialogRef" @addOk="addOk" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, useTemplateRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import axios from "axios"; // 引入axios接口库
import Btns from "@/components/Btns/index.vue";
import AddDialog from "./AddDialog.vue";

import {
  Delete,
  Edit,
  Search,
  Refresh,
  Download,
  Plus,
} from "@element-plus/icons-vue";

//初始加载所有数据
onMounted(() => {
  getList();
});

// 查询条件响应式对象声明
const formInline = reactive({
  classId: "",
  className: "",
  classType: "",
});

// 传递给子组件进行循环展示
const tongji = ref([
  { label: "班级数量", value: 5, type: "primary" },
  { label: "人员总数量", value: 108, type: "success" },
]);

const tableData = ref([]); //表格动态数据
//获取列表
const getList = () => {
  // 向给定ID的用户发起请求
  axios
    .get("/api/getClassList")
    .then(function (res) {
      // 处理成功情况
      tableData.value = res.data;
      console.log(res.data);
    })
    .catch(function (error) {
      // 处理错误情况
      console.log(error);
    })
    .finally(function () {
      // 总是会执行
    });
};

const addDialogRef = useTemplateRef("addDialogRef");
const addAndEdit = (flag) => {
  if (flag === "新增") {
    addDialogRef.value.addDialogObj.show = true;
  } else if (flag === "编辑") {
  }
};

const addOk = () => {
  getList();
};

const deleteRow = async (row) => {
  
  try {
    let isDelete = await ElMessageBox.confirm("是否确认删除该条目?", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
    if(isDelete){
      let res = await axios.delete("/api/getClassList/" + row.id)
      ElMessage({ message: "删除成功", type: "success" });
        // 处理成功情况
        getList();
    }
  } catch (error) {
    ElMessage({
      type: "info",
      message: "已取消",
    });
  }


  // ElMessageBox.confirm("是否确认删除该条目?", "警告", {
  //   confirmButtonText: "确认",
  //   cancelButtonText: "取消",
  //   type: "warning",
  // })
  //   .then(() => {
  //     axios.delete("/api/getClassList/" + row.id).then(function (res) {
  //       ElMessage({ message: "删除成功", type: "success" });
  //       // 处理成功情况
  //       getList();
  //     });
  //   })
  //   .catch(() => {
  //     ElMessage({
  //       type: "info",
  //       message: "已取消",
  //     });
  //   });
};
</script>
