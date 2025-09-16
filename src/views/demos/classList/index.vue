<template>
  <div class="wrap">
    <FormHead>
      <template #forms>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="班级名称">
            <el-input v-model="formInline.className" clearable />
          </el-form-item>
          <el-form-item label="班主任">
            <el-select v-model="formInline.headTeacher" clearable>
              <el-option label="张敏" value="张敏" />
              <el-option label="李强" value="李强" />
            </el-select>
          </el-form-item>
          <el-form-item label="班级类型">
            <el-select v-model="formInline.classType" clearable>
              <el-option label="平行班" value="平行班" />
              <el-option label="实验班" value="实验班" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #btns>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </template>
    </FormHead>
    <Btns :countList="count">
      <template #btn>
        <el-button type="primary" @click="openDialog('新增班级')"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="batchDelete"
          :disabled="multipleSelection.length === 0"
          >批量删除</el-button
        >
      </template>
    </Btns>
    <div class="table">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <!-- 复选框列 -->
        <el-table-column type="selection" width="55" />
        <!-- 内容 -->
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
              @click="openDialog('编辑班级', scope.row)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              plain
              circle
              @click="deleteRow(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddDialog ref="addDialogRef" @addOk="addOk"> </AddDialog>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
  nextTick,
} from "vue";
import Btns from "@/components/Btns/index.vue";
import axios from "axios";
import {
  Delete,
  Edit,
  Search,
  Refresh,
  Download,
  Plus,
} from "@element-plus/icons-vue";
import AddDialog from "./AddDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";

//页面初始调取接口加载全部
onMounted(() => {
  getList();
});

const formInline = reactive({}); //查询条件响应式对象
const tableData = ref([]); // 表格数据
const selectedIds = ref([]); // 选中的ID列表

// 传递给子组件 Btns ，子组件处理后展示
const count = ref([
  { label: "班级数量", value: 0, type: "primary" },
  { label: "人员总数量", value: 0, type: "success" },
]);

//请求接口获取列表
const getList = () => {
  axios
    .get("/api/getClassList")
    .then(function (res) {
      console.log(res.data); //调试器中查看输出的内容
      tableData.value = res.data; //res.data 赋值给表格，在页面中显示
      count.value[0].value = tableData.value.length;
      // count.value[1].value =

      count.value[1].value = tableData.value.reduce((total, item) => {
        return total + item.studentCount;
      }, 0);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // 总是会执行
    });
};

const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 批量删除
const batchDelete = async () => {
  // let ids = multipleSelection.value.map((item) => {
  //   return item.id;
  // })

  try {
    let isDelete = await ElMessageBox.confirm("确认删除吗？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (isDelete) {
      for (const item of multipleSelection.value) {
        await deleteById(item.id);
      }
      ElMessage({ type: "success", message: "删除成功" }); //消息提示
      getList(); //获取列表 
    }
  } catch (error) {
    ElMessage({ type: "info", message: "已取消" });
  }
};

// 删除行
const deleteRow = async (id) => {
  try {
    let isDelete = await ElMessageBox.confirm("确认删除该条目吗？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (isDelete) {
      await deleteById(id);
      ElMessage({ type: "success", message: "删除成功" }); //消息提示
      getList(); //获取列表 
    }
  } catch (error) {
    ElMessage({ type: "info", message: "已取消" });
  }
};

const deleteById = async (id) => {
  await axios.delete("/api/getClassList/" + id); // 用户确认后，发起删除请求
};

// const deleteRow = (row) => {
//   ElMessageBox.confirm("确认删除该条目吗？", "警告", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//   })
//     .then(() => {
//       axios.delete("/api/getClassList/" + row.id).then(() => {
//         ElMessage({ type: "success", message: "删除成功" });
//         getList();
//       });
//     })
//     .catch(() => {
//       ElMessage({ type: "info", message: "已取消" });
//     });
// };

// 弹窗
const addDialogRef = useTemplateRef("addDialogRef");
const openDialog = async (flag, row) => {
  addDialogRef.value.addDialogObj.show = true; //打开弹窗
  addDialogRef.value.addDialogObj.title = flag;

  // DOM 未更新
  await nextTick();
  // DOM 此时已经更新

  //重置
  addDialogRef.value.resetForm();

  if (flag === "新增班级") {
    delete addDialogRef.value.form.id;
  } else if (flag === "编辑班级") {
    let editObj = {
      ...row,
      headTeacher: row.headTeacher.name,
    };
    Object.assign(addDialogRef.value.form, editObj);
    // addDialogRef.value.form = { ...editObj };
  }
};
//弹窗提交（子组件通过emit传递自定义事件，父组件实现操作结果）
const addOk = () => {
  getList();
};
</script>
