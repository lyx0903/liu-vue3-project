<template>
  <div class="dynamic-table-container">
    <div class="table-actions">
      <el-button type="primary" @click="openAddColumnDialog">新增列</el-button>
      <el-button @click="addRow" :disabled="!(tableColumns.length > 0)">
        新增行
      </el-button>
      <el-button
        @click="editHandle"
        :disabled="isEdit || !(tableData.length > 0)"
      >
        编辑
      </el-button>
      <el-button
        @click="saveHandle"
        :disabled="!isEdit || tableData.length === 0"
      >
        保存
      </el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      v-loading="loading"
    >
      <!-- 序号列 -->
      <el-table-column
        label="序号"
        type="index"
        width="80"
        v-if="tableData.length > 0"
      />

      <!-- 动态列 - 通过v-for渲染 -->
      <el-table-column
        v-for="(column, index) in tableColumns"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
      >
        <!-- 可编辑单元格 -->
        <template #default="scope">
          <el-input
            v-if="isEdit"
            v-model="scope.row[column.prop]"
            size="small"
            @blur="handleCellBlur(scope, column.prop)"
            :placeholder="`请输入${column.label}`"
          />
          <span v-else>{{scope.row[column.prop]}}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="120" v-if="tableData.length > 0 && isEdit">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="deleteRow(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增列对话框 -->
    <el-dialog v-model="addColumnDialogVisible" title="新增列" width="30%">
      <el-form
        :model="columnForm"
        :rules="columnRules"
        ref="columnFormRef"
        label-width="80px"
      >
        <el-form-item label="列名" prop="label">
          <el-input v-model="columnForm.label" placeholder="请输入列名" />
        </el-form-item>
        <el-form-item label="字段名" prop="prop">
          <el-input
            v-model="columnForm.prop"
            placeholder="请输入字段名(英文/数字)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addColumnDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddColumn">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";

// 表格列定义
const tableColumns = ref([
  // { label: '姓名', prop: 'name' },
  // { label: '年龄', prop: 'age' },
  // { label: '性别', prop: 'gender' }
]);

// 表格数据
const tableData = ref([
  // { name: '张三', age: '25', gender: '男' },
  // { name: '李四', age: '30', gender: '男' },
  // { name: '王五', age: '28', gender: '女' }
]);

// 状态管理
const addColumnDialogVisible = ref(false);
const loading = ref(false);
const columnFormRef = ref(null);

// 新增列表单数据
const columnForm = reactive({
  label: "",
  prop: "",
});

// 表单验证规则
const columnRules = reactive({
  label: [{ required: true, message: "请输入列名", trigger: "blur" }],
  prop: [
    { required: true, message: "请输入字段名", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "字段名只能包含英文、数字和下划线",
      trigger: "blur",
    },
  ],
});

// 打开新增列对话框
const openAddColumnDialog = () => {
  // 重置表单
  columnForm.label = "";
  columnForm.prop = "";
  if (columnFormRef.value) {
    columnFormRef.value.resetFields();
  }
  addColumnDialogVisible.value = true;
};

// 处理新增列
const handleAddColumn = async () => {
  // 表单验证
  const valid = await columnFormRef.value.validate();
  if (!valid) return;

  // 检查字段名是否已存在
  const propExists = tableColumns.value.some(
    (col) => col.prop === columnForm.prop
  );
  if (propExists) {
    ElMessage.error("字段名已存在，请更换");
    return;
  }

  // 添加新列
  tableColumns.value.push({
    label: columnForm.label,
    prop: columnForm.prop,
  });

  // 为已有行添加新字段
  tableData.value.forEach((row) => {
    row[columnForm.prop] = "";
  });

  addColumnDialogVisible.value = false;
  ElMessage.success("列添加成功");
};

// 新增行
const addRow = () => {
  const newRow = {};
  // 为新行添加所有现有列的字段
  tableColumns.value.forEach((col) => {
    newRow[col.prop] = "";
  });
  tableData.value.push(newRow);
};

// 删除行
const deleteRow = (index) => {
  tableData.value.splice(index, 1);
  ElMessage.success("行已删除");
};

// 单元格失去焦点时的处理
const handleCellBlur = (scope, prop) => {
  // 这里可以添加数据验证或其他处理逻辑
  console.log(`单元格 [${scope.$index}][${prop}] 值为: ${scope.row[prop]}`);
};

const isEdit = ref(false);
const editHandle = () => {
  isEdit.value = true;
};
const saveHandle = () => {
  console.log(tableData.value, "ok");
  isEdit.value = false;
};

// 组件挂载时的初始化操作
onMounted(() => {
  loading.value = false;
});
</script>

<style scoped>
.dynamic-table-container {
  padding: 20px;
}

.table-actions {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}
</style>
