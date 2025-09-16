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
            <el-input v-model.trim="formInline.className" clearable />
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
    <Btns :countList="count">
      <template #btn>
        <el-button type="primary" :icon="Plus" @click="openDialog('新增')"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          @click="batchDelete"
          :disabled="multipleSelection.length === 0"
          >批量删除</el-button
        >
      </template>
    </Btns>
    <div class="table">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <!-- 多选列 -->
        <el-table-column type="selection" width="55" />
        <!-- 内容列 -->
        <el-table-column prop="classId" label="班级编号" width="120" />
        <el-table-column prop="className" label="名称" width="120" />
        <el-table-column prop="headTeacher" label="班主任" width="200">
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
              @click="openDialog('编辑', scope.row)"
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
import { reactive, ref, onMounted, useTemplateRef, nextTick } from "vue";
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
  // console.log("页面已挂载，开始请求数据");
  getList();
});

// 查询条件响应式对象声明
const formInline = reactive({
  classId: "",
  className: "",
  classType: "",
});

// 传递给子组件进行循环展示(value 默认展示0 ，接口获取到列表之后动态计算)
const count = ref([
  { label: "班级数量", value: 0, type: "primary" },
  { label: "人员总数量", value: 0, type: "success" },
]);

const tableData = ref([]); //表格动态数据

//获取列表（请求班级列表、更新表格、计算统计数据）
const getList = () => {
  // 向给定ID的用户发起请求
  axios
    .get("/api/getClassList", { params: formInline })
    .then(function (res) {
      // 处理成功情况，更新表格数据
      tableData.value = res.data;
      console.log(res.data);
      console.log(tableData.value);

      // 更新 count 统计数据：班级数量 = 表格数据长度
      count.value[0].value = tableData.value.length;
      // 更新统计数据：人员总数量 = 所有班级学生数累加
      count.value[1].value = tableData.value.reduce((total, item) => {
        return total + item.studentCount;
      }, 0);
    })
    .catch(function (error) {
      // 处理错误情况
      console.log(error);
    })
    .finally(function () {
      // 总是会执行
    });
};

const formRef = useTemplateRef("formRef");
// 查询
const search = () => {
  getList(); //获取列表，
};

// 重置
const reset = () => {
  formRef.value.resetFields();
  getList();
};

//弹窗
const addDialogRef = useTemplateRef("addDialogRef");

// 打开弹窗（新增、编辑）
const openDialog = async (flag, row) => {
  addDialogRef.value.addDialogObj.show = true;
  addDialogRef.value.addDialogObj.title = flag;

  await nextTick(); // 等待DOM更新完成后再操作表单（避免表单未渲染导致的错误）
  addDialogRef.value.resetForm(); //重置表单

  if (flag === "新增") {
    // 新增场景：移除表单中的id（避免携带旧数据的id）
    delete addDialogRef.value.form.id;
  } else if (flag === "编辑") {
    // 数据回显
    let editObj = {
      ...row,
      headTeacher: row.headTeacher.name,
    };
    Object.assign(addDialogRef.value.form, editObj); // 将行数据合并到表单中
  }
};

const addOk = () => {
  getList();
};

// 监听表格复选框选择变化
const multipleSelection = ref([]); //已选择项
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 批量删除
const batchDelete = async () => {
  try {
    // 显示确认弹窗，等待用户确认
    let isDelete = await ElMessageBox.confirm("确认删除吗?", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 遍历选中的班级，逐个删除
    if (isDelete) {
      for (const item of multipleSelection.value) {
        // return item.id;
        await axios.delete("/api/getClassList/" + item.id);
      }
      // 全部删除成功后提示并刷新列表
      ElMessage({ message: "删除成功", type: "success" });
      getList();
    }
  } catch (error) {
    ElMessage({ type: "info", message: "已取消" });
  }
};

// 删除行（异步函数）
const deleteRow = async (row) => {
  try {
    let isDelete = await ElMessageBox.confirm("是否确认删除该条目?", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (isDelete) {
      let res = await axios.delete("/api/getClassList/" + row.id);
      ElMessage({ message: "删除成功", type: "success" });
      // 处理成功情况
      getList();
    }
  } catch (error) {
    ElMessage({ type: "info", message: "已取消" });
  }

  // 链式调用方法实现
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
