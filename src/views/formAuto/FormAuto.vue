<template>
  <div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      class="demo-tabs"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <div class="tab-content">
          <!-- <p>标题: {{ item.title }}</p> -->
          <p>类型: {{ item.type }}</p>
          <p>编码: {{ item.code }}</p>
          <!-- <p>内容: {{ item.content }}</p> -->
        </div>
        <template v-if="item.type === '1'">
          <DynamicFormTable />
        </template>
        <!-- <component :is="tabs[editableTabsValue]" class="tab"></component> -->
      </el-tab-pane>
    </el-tabs>

    <!-- 新增标签弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增标签页" @close="resetForm">
      <el-form ref="tabForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="title">
          <el-select v-model="form.title" placeholder="请选择">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in titleList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择标签类型">
            <el-option label="普通" value="1"></el-option>
            <el-option label="列表" value="2"></el-option>
            <el-option label="元件" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入标签编码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import DynamicFormTable from "./DynamicFormTable.vue";

let tabIndex = 1;
const editableTabsValue = ref("0");
const editableTabs = ref([
  {
    title: "Tab 1",
    type: "1",
    code: "tab001",
  },
  {
    title: "Tab 2",
    type: "2",
    code: "tab002",
  },
]);

const titleList = [
  { label: "基本信息", value: "基本信息" },
  { label: "雷达", value: "雷达" },
  { label: "武器", value: "武器" },
  { label: "发动机", value: "发动机" },
];

// 弹窗相关
const dialogVisible = ref(false);
const form = reactive({
  title: "",
  type: "",
  code: "",
});

// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择标签类型", trigger: "change" }],
  code: [{ required: true, message: "请输入标签编码", trigger: "blur" }],
};

// 表单引用
const tabForm = ref(null);

// 处理标签编辑事件
const handleTabsEdit = (targetName, action) => {
  if (action === "add") {
    // 重置表单并显示弹窗
    resetForm();
    dialogVisible.value = true;
  } else if (action === "remove") {
    const tabs = editableTabs.value;
    let activeName = editableTabsValue.value;

    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }

    editableTabsValue.value = activeName;
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
  }
};

// 确认添加标签
const confirmAdd = () => {
  tabForm.value.validate((valid) => {
    if (valid) {
      const newTabName = `${++tabIndex}`;
      editableTabs.value.push({
        title: form.title,
        name: newTabName,
        type: form.type,
        code: form.code,
        content: `${form.title} content`,
      });
      editableTabsValue.value = newTabName;
      dialogVisible.value = false;
    }
  });
};

// 重置表单
const resetForm = () => {
  if (tabForm.value) {
    tabForm.value.resetFields();
  }
};
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
}

.tab-content {
  font-size: 14px;
  line-height: 1.6;
}

.tab-content p {
  margin: 8px 0;
}
</style>
