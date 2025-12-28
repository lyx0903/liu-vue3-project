<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInlineRef">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="formInline.name" placeholder="请输入" clearable />
    </el-form-item>

    <el-form-item label="岗位类型" prop="position">
      <el-select v-model="formInline.position" placeholder="请选择" clearable>
        <el-option label="前端" value="前端" />
        <el-option label="后端" value="后端" />
        <el-option label="ui" value="ui" />
      </el-select>
    </el-form-item>

    <el-form-item label="技术栈" prop="techStack">
      <el-select v-model="formInline.techStack" placeholder="请选择" clearable>
        <el-option label="Vue" value="Vue" />
        <el-option label="Java" value="Java" />
        <el-option label="Python" value="Python" />
        <el-option label="UI" value="UI" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="Search" @click="searchTable">查询</el-button>
      <el-button icon="Refresh" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row>
    <el-col :span="12">
      <el-button type="primary" icon="Plus" @click="openDialog('新增')">新增</el-button>
      <el-button type="danger" icon="Delete" @click="onSubmit">批量删除</el-button>
    </el-col>
    <el-col :span="12" align="right">
      <el-input
        v-model.trim="input"
        style="width: 240px"
        placeholder="请输入"
        suffix-icon="Search"
        clearable
      />
    </el-col>
  </el-row>

  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="position" label="岗位类型" />
    <el-table-column prop="techStack" label="技术栈" />
    <el-table-column prop="contact" label="联系方式" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button plain type="primary" icon="Edit" size="small" @click="openDialog('编辑', scope.row)" >编辑</el-button>
        <el-button plain type="danger" icon="Delete" size="small" @click="deleteRow(scope.row.id)" >删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="demo-pagination-block">
    <el-pagination
      style="margin-top: 10px"
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 新增/编辑弹窗 -->
  <el-dialog
    v-model="dialogObj.show"
    :title="dialogObj.title"
    :width="dialogObj.width"
  >
    <el-form :model="dialogForm" ref="dialogFormRef">
      <el-form-item
        label="姓名"
        :label-width="dialogObj.labelWidth"
        prop="name"
      >
        <el-input v-model="dialogForm.name" autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="岗位类型"
        :label-width="dialogObj.labelWidth"
        prop="position"
      >
        <el-select v-model="dialogForm.position" placeholder="请选择" clearable>
          <el-option label="前端" value="前端" />
          <el-option label="后端" value="后端" />
          <el-option label="ui" value="ui" />
        </el-select>
      </el-form-item>

      <el-form-item
        label="技术栈"
        :label-width="dialogObj.labelWidth"
        prop="techStack"
      >
        <el-select
          v-model="dialogForm.techStack"
          placeholder="请选择"
          clearable
        >
          <el-option label="Vue" value="Vue" />
          <el-option label="Java" value="Java" />
          <el-option label="Python" value="Python" />
          <el-option label="UI" value="UI" />
        </el-select>
      </el-form-item>

      <el-form-item
        label="联系方式"
        :label-width="dialogObj.labelWidth"
        prop="contact"
      >
        <el-input v-model="dialogForm.contact" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogObj.show = false">取消</el-button>
        <el-button type="primary" @click="confirmSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from "axios";

// 页面初始化时获取表格数据
onMounted(() => {
  getTableData();
});

const getTableData = () => {
  axios.get("/api/personList", { params: formInline }).then((res) => {
    console.log(res.data);
    tableData.value = res.data;
  });
};

const formInline = reactive({}); //查询条件
const tableData = ref([]); //表格数据

// 查询
const searchTable = () => {
  getTableData();
};
// 重置
const formInlineRef = useTemplateRef("formInlineRef");
const resetForm = () => {
  formInlineRef.value.resetFields(); //清空表单
  getTableData(); //重置后查询所有数据
};

// 新增|编辑
// 1.弹窗配置信息
const dialogObj = reactive({
  title: "",
  show: false,
  width: "500px",
  labelWidth: "100px",
});
// 2.弹窗表单数据
const dialogForm = reactive({
  name: "",
  position: "",
  techStack: "",
  contact: "",
});
const dialogFormRef = useTemplateRef("dialogFormRef");
const openDialog = async (flag, row) => {
  dialogObj.show = true;
  dialogObj.title = flag;
  // DOM 未更新
  await nextTick();
  dialogFormRef.value.resetFields();

  if (flag === "新增") {
    // dialogFormRef.value = {...dialogFormRef.value}
  } else if (flag === "编辑") {
    const editObj = { ...row };
    Object.assign(dialogForm, editObj);
  }

  console.log(dialogFormRef.value);
};
// 提交弹窗
const confirmSubmit = () => {
  if (dialogObj.title === "新增") {
    // 新增
    axios.post("/api/personList", dialogForm).then((res) => {
      ElMessage.success("新增成功");
      dialogObj.show = false;
      getTableData();
    });
  } else if (dialogObj.title === "编辑") {
    // 编辑
    axios.put(`/api/personList/${dialogForm.id}`, dialogForm).then((res) => {
      ElMessage.success("编辑成功");
      dialogObj.show = false;
      getTableData();
    });
  }
};

// 删除
 const deleteRow = async(id)=>{
  try {
    let isDelete = await ElMessageBox.confirm(
    '确认删除该数据吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    if(isDelete){
      await axios.delete(`/api/personList/${id}`).then(() => {
        ElMessage.success("删除成功");
        dialogObj.show = false;
        getTableData();
      });
    }
  } catch (error) {
      ElMessage({ type: "info", message: "用户取消操作" });
    }
 }

const input = ref("");

const currentPage4 = ref(4);

const pageSize4 = ref(10);
const size = ref("default");
const background = ref(true);
const disabled = ref(false);

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
