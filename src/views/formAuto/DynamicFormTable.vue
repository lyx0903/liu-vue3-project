<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">动态表单管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        新增字段
      </el-button>
      <el-button type="primary" @click="editHandle" :disabled="isEdit"> 编辑 </el-button>
      <el-button type="primary" @click="saveHandle" :disabled="!isEdit"> 保存 </el-button>
    </div>

    <!-- 动态表单表格 -->
    <table>
      <tr v-for="(item, index) in formItems" :key="index">
        <td>{{ item.label }}</td>
        <td>
          <el-input
            v-if="isEdit"
            v-model="item.value"
            size="small"
            placeholder="请输入"
          ></el-input>
          <el-text v-else>{{ item.value }}</el-text>
        </td>
        <td v-if="isEdit">
          <el-button type="text" @click="handleDelete(item)"> 删除 </el-button>
        </td>
      </tr>
    </table>

    <!-- 新增字段弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      title="新增表单字段"
      width="500px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="newFormItem"
        :rules="formRules"
        label-width="100px"
        class="p-2"
      >
        <el-form-item label="字段名称" prop="label">
          <el-input
            v-model="newFormItem.label"
            placeholder="请输入字段名称"
            class="transition-all duration-200"
          ></el-input>
        </el-form-item>

        <el-form-item label="字段编码" prop="code">
          <el-input
            v-model="newFormItem.code"
            placeholder="请输入字段编码"
            class="transition-all duration-200"
          ></el-input>
        </el-form-item>

        <el-form-item label="字段值" prop="value">
          <el-input
            v-model="newFormItem.value"
            placeholder="请输入字段值"
            class="transition-all duration-200"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button
          @click="handleDialogClose"
          class="transition-all duration-200"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleAddFormSubmit"
          class="transition-all duration-200 hover:shadow-md"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

const isEdit = ref(false);
const editHandle = () => {
  isEdit.value = true;
};
const saveHandle = () => {
  console.log(formItems, 'biaoge');
  isEdit.value = false;
};


// 表单数据
const formItems = ref([
  { label: "姓名", code: "name", value: "张三" },
  { label: "年龄", code: "age", value: "25" },
  { label: "邮箱", code: "email", value: "zhangsan@example.com" },
]);

// 新增弹窗状态
const showAddDialog = ref(false);

// 新增表单数据
const newFormItem = reactive({
  label: "",
  code: "",
  value: "",
});

// 表单验证规则
const formRules = {
  label: [
    { required: true, message: "请输入字段名称", trigger: "blur" },
    {
      min: 1,
      max: 20,
      message: "字段名称长度在 1 到 20 个字符",
      trigger: "blur",
    },
  ],
  code: [
    { required: true, message: "请输入字段编码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "编码只能包含字母、数字和下划线",
      trigger: "blur",
    },
  ],
  value: [{ required: true, message: "请输入字段值", trigger: "blur" }],
};

// 表单引用
const addFormRef = ref(null);

// 处理新增表单提交
const handleAddFormSubmit = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      // 检查编码是否已存在
      const codeExists = formItems.value.some(
        (item) => item.code === newFormItem.code
      );
      if (codeExists) {
        ElMessage.error("该字段编码已存在，请更换");
        return;
      }

      // 添加新字段到表格
      formItems.value.push({ ...newFormItem });

      // 重置表单并关闭弹窗
      resetForm();
      showAddDialog.value = false;

      ElMessage.success("字段添加成功");
    }
  });
};

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除字段"${row.label}"吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      formItems.value = formItems.value.filter(
        (item) => item.code !== row.code
      );
      ElMessage.success("删除成功");
    })
    .catch(() => {
      // 取消删除
    });
};

// 重置表单
const resetForm = () => {
  newFormItem.label = "";
  newFormItem.code = "";
  newFormItem.value = "";
  if (addFormRef.value) {
    addFormRef.value.resetFields();
  }
};

// 处理弹窗关闭
const handleDialogClose = () => {
  resetForm();
  showAddDialog.value = false;
};

// 引入Element Plus的消息提示和确认框组件
import { ElMessage, ElMessageBox } from "element-plus";
</script>

<style scoped>
.container {
  padding-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse
}
table tr {
}
table tr th,
table tr td {
  border: #ddd 1px solid;
}
</style>
