<template>
  <div class="cont">
    <el-row>
      <el-col :span="12">
        <!-- 新增元件按钮 -->
        <el-button type="primary" @click="openComponentDialog">
          新增元件
        </el-button>
      </el-col>
      <el-col :span="12" align="right">
        <!-- 新增元件按钮 -->
        <el-button type="warning" @click="editHandle">编辑</el-button>
        <el-button type="primary" @click="saveHandle">保存</el-button>
      </el-col>
    </el-row>

    <!-- 元件列表 -->
    <div
      class="comp-card"
      v-for="(component, compIndex) in components"
      :key="compIndex"
      :border="true"
    >
      <div class="card-header">
        <div class="comp-info">
          <span class="comp-name">
            <el-icon style="color: #999"><Help /></el-icon>
            {{ component.yjmc }}
          </span>
          <span class="comp-code">({{ component.yjbs }})</span>
          <span class="comp-sort">排序: {{ component.px }}</span>
        </div>
        <el-button
          size="small"
          @click="openAttributeDialog(compIndex, component.attrs.length + 1)"
        >
          新增属性
        </el-button>
      </div>

      <!-- 属性表格 - 使用原生表格 -->
      <table class="my-table">
        <thead>
          <tr>
            <th width="200px">属性名称</th>
            <th width="200px">属性标识</th>
            <th>属性值</th>
            <th width="120px" align="center">排序</th>
            <th width="100px" align="center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(attr, attrIndex) in component.attrs" :key="attrIndex">
            <td>{{ attr.sxmc }}</td>
            <td>{{ attr.sxbs }}</td>
            <td>
              <el-input v-if="isEdit" v-model="attr.sxz" class="value-input" />
              <span v-else>{{ attr.sxz }}</span>
            </td>
            <td align="center">
              <el-input-number
                v-if="isEdit"
                controls-position="right"
                v-model="attr.xh"
                class="value-input"
              />
              <span v-else>{{ attr.xh }}</span>
            </td>
            <td align="center">
              <el-button
                type="danger"
                link
                @click="deleteAttribute(compIndex, attrIndex)"
              >
                删除
              </el-button>
            </td>
          </tr>
          <tr v-if="component.attrs.length === 0">
            <td colspan="5" class="empty-row">
              暂无属性，请点击"新增属性"按钮添加
            </td>
          </tr>
        </tbody>
      </table>
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
          <el-input-number
            v-model.number="componentForm.px"
            placeholder="请输入排序号"
            controls-position="right"
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
        <el-form-item label="序号" prop="xh">
          <el-input-number
            v-model="attributeForm.xh"
            placeholder="请输入属序号"
            controls-position="right"
          />
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
      { sxmc: "长度", sxbs: "cd", sxz: "10cm", xh: 1 },
      { sxmc: "重量", sxbs: "zl", sxz: "25kg", xh: 2 },
    ],
  },
]);

const isEdit = ref(false);
const editHandle = () => {
  isEdit.value = true;
};
const saveHandle = () => {
  isEdit.value = false;
};

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
  xh: 1,
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
  xh: [
    { required: true, message: "请输入序号", trigger: "blur" },
    { type: "number", message: "序号必须是数字", trigger: "blur" },
  ],
});

// 打开新增元件对话框
const openComponentDialog = () => {
  // 重置表单
  componentForm.yjmc = "";
  componentForm.yjbs = "";
  componentForm.attrs = [];
  if (componentFormRef.value) {
    componentFormRef.value.resetFields();
  }
  componentForm.px = components.value.length + 1;
  componentDialogVisible.value = true;
};

// 打开新增属性对话框
const openAttributeDialog = (index, xh) => {
  currentComponentIndex.value = index;
  // 重置表单
  attributeForm.sxmc = "";
  attributeForm.sxbs = "";
  attributeForm.sxz = "";
  if (attributeFormRef.value) {
    attributeFormRef.value.resetFields();
  }
  attributeForm.xh = xh;
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
    xh: attributeForm.xh,
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

<style scoped lang="scss">
.cont {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .comp-card {
    border: 1px solid #ddd;
    padding: 10px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .comp-info {
        display: flex;
        align-items: center;
        gap: 10px;
        .comp-name {
          font-weight: bold;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .comp-code {
          color: #666;
          background-color: #f5f7fa;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .comp-sort {
          color: #909399;
          font-size: 12px;
        }
      }
    }
  }
}

.my-table {
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 6px;
    // text-align: left;
    font-size: 14px;
    line-height: 34px;
  }
  td {
    &:first-child {
      background-color: #f5f7fa;
    }
  }
  th {
    background-color: #f5f7fa;
    font-weight: 500;
    color: #606266;
  }
  tr:nth-child(even) {
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
}
</style>
