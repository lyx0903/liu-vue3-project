<template>
  <div class="component-manager">
    <!-- 新增元件按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      @click="openComponentDialog"
      class="add-component-btn"
    >
      新增元件
    </el-button>

    <!-- 元件列表 -->
    <div class="components-container">
      <el-card
        v-for="(component, compIndex) in components"
        :key="compIndex"
        :border="true"
        class="component-card"
      >
        <template #header>
          <div class="card-header">
            <div class="component-info">
              <span class="component-name">{{ component.yjmc }}</span>
              <span class="component-code">({{ component.yjbs }})</span>
              <span class="component-sort">排序: {{ component.px }}</span>
            </div>
            <el-button icon="Plus" @click="openAttributeDialog(compIndex)">
              新增属性
            </el-button>
          </div>
        </template>

        <!-- 属性表格 - 使用原生表格 -->
        <table class="attributes-table">
          <thead>
            <tr>
              <th>属性名称</th>
              <th>属性标识</th>
              <th>属性值</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attr, attrIndex) in component.attrs" :key="attrIndex">
              <td>{{ attr.sxmc }}</td>
              <td>{{ attr.sxbs }}</td>
              <td>
                <el-input v-model="attr.sxz" size="small" class="value-input" />
              </td>
              <td>
                <el-button
                  type="danger"
                  @click="deleteAttribute(compIndex, attrIndex)"
                >
                  删除
                </el-button>
              </td>
            </tr>
            <tr v-if="component.attrs.length === 0">
              <td colspan="4" class="empty-row">
                暂无属性，请点击"新增属性"按钮添加
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>

    <!-- 新增元件对话框 -->
    <el-dialog v-model="componentDialogVisible" title="新增元件" width="400px">
      <el-form
        :model="componentForm"
        :rules="componentRules"
        ref="componentFormRef"
        label-width="100px"
      >
        <el-form-item label="元件名称" prop="yjmc">
          <el-input v-model="componentForm.yjmc" placeholder="请输入元件名称" />
        </el-form-item>
        <el-form-item label="元件标识" prop="yjbs">
          <el-input
            v-model="componentForm.yjbs"
            placeholder="请输入元件标识（英文/数字）"
          />
        </el-form-item>
        <el-form-item label="排序" prop="px">
          <el-input
            v-model.number="componentForm.px"
            placeholder="请输入排序号"
            type="number"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="componentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addComponent">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增属性对话框 -->
    <el-dialog v-model="attributeDialogVisible" title="新增属性" width="400px">
      <el-form
        :model="attributeForm"
        :rules="attributeRules"
        ref="attributeFormRef"
        label-width="100px"
      >
        <el-form-item label="属性名称" prop="sxmc">
          <el-input v-model="attributeForm.sxmc" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="属性标识" prop="sxbs">
          <el-input
            v-model="attributeForm.sxbs"
            placeholder="请输入属性标识（英文/数字）"
          />
        </el-form-item>
        <el-form-item label="属性值" prop="sxz">
          <el-input v-model="attributeForm.sxz" placeholder="请输入属性值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="attributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAttribute">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 元件列表数据，遵循指定的数据结构
const components = ref([
  {
    yjmc: "雷达",
    yjbs: "ld",
    px: 1,
    attrs: [
      { sxmc: "长度", sxbs: "cd", sxz: "10cm" },
      { sxmc: "重量", sxbs: "zl", sxz: "25kg" },
    ],
  },
]);

// 对话框状态
const componentDialogVisible = ref(false);
const attributeDialogVisible = ref(false);
const currentComponentIndex = ref(-1); // 当前操作的元件索引

// 表单引用
const componentFormRef = ref(null);
const attributeFormRef = ref(null);

// 新增元件表单数据
const componentForm = reactive({
  yjmc: "",
  yjbs: "",
  px: 1,
});

// 新增属性表单数据
const attributeForm = reactive({
  sxmc: "",
  sxbs: "",
  sxz: "",
});

// 元件表单验证规则
const componentRules = reactive({
  yjmc: [{ required: true, message: "请输入元件名称", trigger: "blur" }],
  yjbs: [
    { required: true, message: "请输入元件标识", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "只能包含英文、数字和下划线",
      trigger: "blur",
    },
  ],
  px: [
    { required: true, message: "请输入排序号", trigger: "blur" },
    { type: "number", message: "排序号必须是数字", trigger: "blur" },
  ],
});

// 属性表单验证规则
const attributeRules = reactive({
  sxmc: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
  sxbs: [
    { required: true, message: "请输入属性标识", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "只能包含英文、数字和下划线",
      trigger: "blur",
    },
  ],
  sxz: [{ required: true, message: "请输入属性值", trigger: "blur" }],
});

// 打开新增元件对话框
const openComponentDialog = () => {
  // 重置表单
  componentForm.yjmc = "";
  componentForm.yjbs = "";
  componentForm.px = 1;
  if (componentFormRef.value) {
    componentFormRef.value.resetFields();
  }
  componentDialogVisible.value = true;
};

// 打开新增属性对话框
const openAttributeDialog = (index) => {
  currentComponentIndex.value = index;
  // 重置表单
  attributeForm.sxmc = "";
  attributeForm.sxbs = "";
  attributeForm.sxz = "";
  if (attributeFormRef.value) {
    attributeFormRef.value.resetFields();
  }
  attributeDialogVisible.value = true;
};

// 添加新元件
const addComponent = async () => {
  // 表单验证
  const valid = await componentFormRef.value.validate();
  if (!valid) return;

  // 检查元件标识是否已存在
  const exists = components.value.some(
    (item) => item.yjbs === componentForm.yjbs
  );
  if (exists) {
    ElMessage.error("元件标识已存在，请更换");
    return;
  }

  // 添加新元件
  components.value.push({
    yjmc: componentForm.yjmc,
    yjbs: componentForm.yjbs,
    px: componentForm.px,
    attrs: [],
  });

  // 按排序号排序
  components.value.sort((a, b) => a.px - b.px);

  componentDialogVisible.value = false;
  ElMessage.success("元件添加成功");
};

// 添加新属性
const addAttribute = async () => {
  // 表单验证
  const valid = await attributeFormRef.value.validate();
  if (!valid) return;

  // 检查属性标识是否已存在
  const currentComponent = components.value[currentComponentIndex.value];
  const exists = currentComponent.attrs.some(
    (attr) => attr.sxbs === attributeForm.sxbs
  );
  if (exists) {
    ElMessage.error("属性标识已存在，请更换");
    return;
  }

  // 添加新属性
  currentComponent.attrs.push({
    sxmc: attributeForm.sxmc,
    sxbs: attributeForm.sxbs,
    sxz: attributeForm.sxz,
  });

  attributeDialogVisible.value = false;
  ElMessage.success("属性添加成功");
};

// 删除属性
const deleteAttribute = (compIndex, attrIndex) => {
  ElMessageBox.confirm("确定要删除这个属性吗？", "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      components.value[compIndex].attrs.splice(attrIndex, 1);
      ElMessage.success("属性已删除");
    })
    .catch(() => {
      // 取消删除
    });
};

onMounted(() => {
  // 组件挂载时的初始化操作
  console.log("组件已挂载", components.value);
});
</script>

<style scoped>
.component-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.add-component-btn {
  margin-bottom: 20px;
}

.components-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 20px;
}

.component-card {
  transition: all 0.3s ease;
}

.component-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.component-name {
  font-weight: bold;
  font-size: 16px;
}

.component-code {
  color: #666;
  background-color: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.component-sort {
  color: #909399;
  font-size: 12px;
}

.attributes-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.attributes-table th,
.attributes-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
}

.attributes-table th {
  background-color: #f5f7fa;
  font-weight: 500;
  color: #606266;
}

.attributes-table tr:nth-child(even) {
  background-color: #fafafa;
}

.value-input {
  width: 100%;
}

.empty-row {
  text-align: center;
  color: #909399;
  padding: 30px 0;
}
</style>
