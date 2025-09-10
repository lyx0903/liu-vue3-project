<template>
  <div class="wrap">
    <!-- ================================================================================ 查询条件  -->
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      ref="formRef"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="formInline.name"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formInline.sex" placeholder="请选择性别" clearable>
          <el-option label="男" value="man" />
          <el-option label="女" value="women" />
        </el-select>
      </el-form-item>
      <el-form-item label="爱好" prop="hobby">
        <el-select
          v-model="formInline.hobby"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择爱好"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="search"
          >查询</el-button
        >
        <el-button type="info" :icon="Refresh" @click="reset" plain
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <!-- ================================================================================ 按钮组（新增。。）  -->
    <el-button type="primary" :icon="Plus" class="!ml-0" @click="openAddDialog"
      >新增</el-button
    >
    <el-button type="success" :icon="Download">导出</el-button>
    <!-- ================================================================================ 表格  -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="sex" label="性别">
        <!-- 显示时转换为中文 -->
        <template #default="scope">
          {{
            scope.row.sex === "man"
              ? "男"
              : scope.row.sex === "women"
              ? "女"
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="hobby" label="爱好">
        <!-- 显示时转换为中文标签 -->
        <template #default="scope">
          {{ scope.row.hobby.map((h) => getHobbyLabel(h)).join("、") }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default>
          <el-button type="primary" :icon="Edit" plain circle />
          <el-button
            type="danger"
            :icon="Delete"
            plain
            circle
            @click="deleteRow"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- ================================================================================ 弹窗  -->
    <el-dialog v-model="dialogFormVisible" title="新增" width="500">
      <el-form :model="form" ref="addFormRef" :rules="rules">
        <!-- prop 必须与 rules 中的 key 一致 -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" clearable>
            <el-option label="男" value="man" />
            <el-option label="女" value="women" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            controls-position="right"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="爱好" prop="hobby">
          <el-select
            v-model="form.hobby"
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addItem"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  Delete,
  Edit,
  Search,
  Refresh,
  Download,
  Plus,
} from "@element-plus/icons-vue";

// 查询条件响应式对象声明
const formInline = reactive({
  name: "",
  sex: "",
  age: "",
  hobby: [],
});
// 爱好下拉框
const options = [
  { value: "singing", label: "唱歌" },
  { value: "dancing", label: "跳舞" },
  { value: "drawing", label: "画画" },
];

// 表格引用
const formRef = ref(null); // 模板中 ref="xxx" 必须在脚本中用 ref(null) 创建对应的引用（const xxx = ref(null)），才能通过 xxx.value 获取到组件 / 元素实例。
// 表格数据
const tableData = ref([]);
// 数据源
const data = [
  { name: "Tom", sex: "man", age: 18, hobby: ["singing", "drawing"] },
  { name: "Alice", sex: "women", age: 15, hobby: ["singing"] },
  { name: "Bob", sex: "man", age: 23, hobby: ["singing", "dancing"] },
];

// 根据爱好value获取显示标签（用于表格展示）
const getHobbyLabel = (value) => {
  const item = options.find((option) => option.value === value);
  return item ? item.label : "";
};

// 查询（从表格中过滤数据）
const search = () => {
  const filterData = data.filter((item) => {
    const nameMatch = !formInline.name || item.name.includes(formInline.name);
    const sexMatch = !formInline.sex || item.sex === formInline.sex;
    const hobbyMtch =
      formInline.hobby.length === 0
        ? true
        : formInline.hobby.every((h) => {
            item.hobby.inclouds(h);
          });
    return nameMatch && sexMatch && hobbyMtch; // 所有条件都满足才保留
  });
  tableData.value = filterData;
};

// 重置(清空查询条件、去除表格过滤)
const reset = () => {
  if (formRef.value) {
    formRef.value.resetFields(); // Element Plus 表单内置的重置方法
    // 原理：将每个 prop 绑定的字段重置为 formInline 中的初始值
    search(); // 重置后重新查询
  }
};

// 表格删除行
const deleteRow = (index) => {
  tableData.value.splice(index, 1); //从index开始，删除一个元素
};

//  初始加载全部数据
onMounted(() => search());

// ================================================================================ 弹窗
const dialogFormVisible = ref(false); //弹窗默认状态
const addFormRef = ref(null);

// 弹窗表单数据（初始为空）
const form = reactive({
  name: "",
  sex: "",
  age: "",
  hobby: [],
});

// 打开新增弹窗
const openAddDialog = () => {
  dialogFormVisible.value = true;
  if (addFormRef.value) {
    addFormRef.value.resetFields();
  }
};
// 弹窗验证规则
const rules = reactive({
  name: [
    // 规则1：必填
    { required: true, message: "请输入姓名", trigger: "blur" },
    // 规则2：长度 2-5 字符
    { min: 2, max: 5, message: "长度2-5个字符", trigger: "blur" },
  ],
  sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  age: [
    { required: true, message: "请输入年龄", trigger: "blur" },
    {
      type: "number",
      min: 1,
      max: 120,
      message: "年龄在1-120之间",
      trigger: "blur",
    },
  ],
  hobby: [{ required: true, message: "请选择爱好", trigger: "blur" }],
});
// 弹窗提交
const addItem = () => {
  const newItem = {
    name: form.name,
    sex: form.sex,
    age: form.age,
    hobby: form.hobby,
  };
  addFormRef.value.validate((valid) => {
    if (valid) {
      data.push(newItem);
      dialogFormVisible.value = false;

      ElMessage({ message: "添加成功", type: "success" });
      search();
    } else {
      console.log("error submit!", fields); //fields:	获取所有字段的 context
    }
  });
};

const handleChange = (value) => {
  console.log(value);
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

<!-- 爱好筛选不生效；编辑功能；新增时年龄默认是0；  -->
