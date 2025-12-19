<template>
  <div class="daily-work-report">
    <!-- 操作按钮区 -->
    <div class="operation-area">
      <!-- 日期范围选择器 -->
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 300px"
      />

      <!-- 搜索输入框 -->
      <el-input
        v-model="searchKeyword"
        placeholder="搜索内容或备注"
        style="width: 300px; margin-left: 20px"
        clearable
        @input="handleSearch"
      />

      <!-- 搜索按钮 -->
      <el-button type="success" @click="handleSearch" style="margin-left: 10px"
        >搜索</el-button
      >

      <!-- 重置按钮 -->
      <el-button @click="resetSearch" style="margin-left: 10px">重置</el-button>
    </div>

    <!-- 日报表格 -->
    <el-table
      :data="filteredReportData"
      style="width: 100%"
      :span-method="objectSpanMethod"
      border
      :header-cell-style="{ backgroundColor: '#EBF4FB' }"
    >
      <el-table-column label="日期" width="150">
        <template #default="scope">
          <div v-if="scope.row.isEditing">
            <el-date-picker
              v-model="scope.row.date"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
              style="width: 100%"
              @change="handleDateChange(scope.row)"
            />
          </div>
          <div v-else>{{ scope.row.date }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="weekday" label="星期" width="100" />
      <el-table-column label="内容" min-width="300">
        <template #default="scope">
          <div v-if="scope.row.isEditing">
            <el-input
              v-model="scope.row.content"
              type="textarea"
              :rows="3"
              placeholder="请输入工作内容"
            />
          </div>
          <div v-else>{{ scope.row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column label="周总结" min-width="200">
        <template #default="scope">
          <div v-if="scope.row.isEditingWeekSummary">
            <el-input
              v-model="scope.row.weekSummary"
              type="textarea"
              :rows="2"
              placeholder="请输入周总结"
            />
          </div>
          <div v-else @click="handleEditWeekSummary(scope.row)">
            {{ scope.row.weekSummary }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200">
        <template #default="scope">
          <div v-if="scope.row.isEditing">
            <el-input
              v-model="scope.row.remarks"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
            />
          </div>
          <div v-else>{{ scope.row.remarks }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <template v-if="scope.row.isEditing">
            <el-button
              type="success"
              size="small"
              @click="handleSaveEdit(scope.row)"
              >保存</el-button
            >
            <el-button size="small" @click="handleCancelEdit(scope.row)"
              >取消</el-button
            >
          </template>
          <template v-else-if="scope.row.isEditingWeekSummary">
            <el-button
              type="success"
              size="small"
              @click="handleSaveWeekSummary(scope.row)"
              >保存</el-button
            >
            <el-button size="small" @click="handleCancelEditWeekSummary(scope.row)"
              >取消</el-button
            >
          </template>
          <template v-else>
            <el-button
              type="primary"
              size="small"
              @click="handleStartEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表格操作区 -->
    <div class="table-operation-area">
      <el-button
        type="primary"
        @click="handleAddInTable"
      >
        新增
      </el-button>
    </div>

    <!-- 新增日报对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="新增日报"
      width="50%"
      @close="resetAddForm"
    >
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="addForm.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="addForm.content"
            type="textarea"
            :rows="3"
            placeholder="请输入工作内容"
          />
        </el-form-item>
        <el-form-item label="周总结" prop="weekSummary">
          <el-input
            v-model="addForm.weekSummary"
            type="textarea"
            :rows="2"
            placeholder="请输入周总结"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addForm.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="showDeleteDialog" title="删除确认" width="30%">
      <div>
        确定要删除 <strong>{{ deleteForm.date }}</strong> 的日报吗？
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";

// 节假日列表（可扩展）
const holidays = [
  "2025-01-01",
  "2025-02-01",
  "2025-02-02",
  "2025-02-03",
  "2025-02-04",
  "2025-02-05",
  "2025-02-06",
];

// 日报数据 - 添加weekNumber字段标识周和isEditing字段用于行内编辑
const dailyReportData = ref([
  {
    id: 1,
    date: "2025-12-16",
    weekday: "星期二",
    content: "完成Vue路由配置，修复菜单渲染问题",
    weekSummary: "本周主要完成了路由配置和菜单结构优化",
    remarks: "需确认路由路径大小写规范",
    weekNumber: 50,
    isEditing: false,
    isEditingWeekSummary: false,
  },
  {
    id: 2,
    date: "2025-12-17",
    weekday: "星期三",
    content: "创建日常工作和Vue文档学习菜单",
    weekSummary: "本周主要完成了路由配置和菜单结构优化",
    remarks: "已解决菜单重复显示问题",
    weekNumber: 50,
    isEditing: false,
    isEditingWeekSummary: false,
  },
  {
    id: 3,
    date: "2025-12-18",
    weekday: "星期四",
    content: "实现日报表格功能",
    weekSummary: "本周主要完成了路由配置和菜单结构优化",
    remarks: "需添加表格数据管理功能",
    weekNumber: 50,
    isEditing: false,
    isEditingWeekSummary: false,
  },
  {
    id: 4,
    date: "2025-12-23",
    weekday: "星期二",
    content: "优化日报表格，实现周总结合并功能",
    weekSummary: "本周主要完成了日报表格的优化和功能扩展",
    remarks: "已完成单元格合并功能",
    weekNumber: 51,
    isEditing: false,
    isEditingWeekSummary: false,
  },
  {
    id: 5,
    date: "2025-12-24",
    weekday: "星期三",
    content: "添加更多测试数据",
    weekSummary: "本周主要完成了日报表格的优化和功能扩展",
    remarks: "准备下周开发计划",
    weekNumber: 51,
    isEditing: false,
    isEditingWeekSummary: false,
  },
]);

// 搜索关键词
const searchKeyword = ref("");

// 日期范围
const dateRange = ref([]);

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 用于存储合并单元格的规则
const spanArr = ref([]);
const position = ref(0);

// 排序数据：先按周数降序，再按日期降序
const sortReportData = (data) => {
  return [...data].sort((a, b) => {
    // 先按周数降序
    if (a.weekNumber !== b.weekNumber) {
      return b.weekNumber - a.weekNumber;
    }
    // 再按日期降序
    return new Date(b.date) - new Date(a.date);
  });
};

// 计算属性：过滤出工作日数据（周一至周五，且非节假日）
const workdayReportData = computed(() => {
  const filtered = dailyReportData.value.filter((item) => {
    // 判断是否为节假日
    if (holidays.includes(item.date)) {
      return false;
    }

    // 将日期字符串转换为Date对象
    const date = new Date(item.date);
    // 获取星期几（0=周日, 1=周一, ..., 6=周六）
    const dayOfWeek = date.getDay();
    // 只返回周一至周五的数据（1-5）
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  });
  
  // 返回排序后的数据
  return sortReportData(filtered);
});

// 计算属性：搜索过滤后的日报数据（未分页）
const allFilteredReportData = computed(() => {
  const filteredData = workdayReportData.value.filter((item) => {
    // 日期范围过滤
    if (dateRange.value && dateRange.value.length === 2) {
      const [startDate, endDate] = dateRange.value;
      const itemDate = item.date;
      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
    }

    // 关键词过滤
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      return (
        item.content.toLowerCase().includes(keyword) ||
        item.remarks.toLowerCase().includes(keyword) ||
        item.weekSummary.toLowerCase().includes(keyword)
      );
    }

    return true;
  });

  // 更新总数
  total.value = filteredData.length;

  return filteredData;
});

// 计算属性：分页后的日报数据
const filteredReportData = computed(() => {
  // 计算起始索引和结束索引
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;

  // 返回分页后的数据
  const pageData = allFilteredReportData.value.slice(startIndex, endIndex);
  
  // 重新计算合并规则
  calculateSpan(pageData);
  
  return pageData;
});

// 重置搜索条件
const resetSearch = async () => {
  searchKeyword.value = "";
  dateRange.value = [];
  currentPage.value = 1;

  // 重新计算合并单元格
  await nextTick();
  calculateSpan(allFilteredReportData.value.slice(0, pageSize.value));
};

// 新增表单数据
const showAddDialog = ref(false);
const addFormRef = ref();
const addForm = ref({
  date: "",
  content: "",
  weekSummary: "",
  remarks: "",
});

// 表单验证规则
const formRules = ref({
  date: [{ required: true, message: "请选择日期", trigger: "blur" }],
  content: [
    { required: true, message: "请输入工作内容", trigger: "blur" },
    { min: 10, message: "内容不能少于10个字符", trigger: "blur" },
  ],
  weekSummary: [
    { required: true, message: "请输入周总结", trigger: "blur" },
    { min: 5, message: "周总结不能少于5个字符", trigger: "blur" },
  ],
});

// 获取星期几的中文名称
const getWeekday = (dateString) => {
  const date = new Date(dateString);
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  return weekdays[date.getDay()];
};

// 获取日期所在的周数
const getWeekNumber = (dateString) => {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// 重置新增表单
const resetAddForm = () => {
  if (addFormRef.value) {
    addFormRef.value.resetFields();
  }
  addForm.value = {
    date: "",
    content: "",
    weekSummary: "",
    remarks: "",
  };
};

// 同步更新同一周的所有记录的周总结
const syncWeekSummary = (weekNumber, summary) => {
  dailyReportData.value.forEach(item => {
    if (item.weekNumber === weekNumber) {
      item.weekSummary = summary;
    }
  });
};

// 处理新增日报
const handleAdd = async () => {
  if (!addFormRef.value) return;

  try {
    await addFormRef.value.validate();

    // 检查是否为工作日
    const date = new Date(addForm.value.date);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      ElMessage.warning("只能添加工作日的日报");
      return;
    }

    // 检查是否为节假日
    const dateString = addForm.value.date;
    if (holidays.includes(dateString)) {
      ElMessage.warning("节假日不需要添加日报");
      return;
    }

    // 检查日期是否已存在
    if (dailyReportData.value.some((item) => item.date === dateString)) {
      ElMessage.warning("该日期的日报已存在");
      return;
    }

    // 生成新的日报记录
    const newReport = {
      id: Date.now(),
      date: dateString,
      weekday: getWeekday(dateString),
      content: addForm.value.content,
      weekSummary: addForm.value.weekSummary,
      remarks: addForm.value.remarks || "",
      weekNumber: getWeekNumber(dateString),
      isEditing: false,
      isEditingWeekSummary: false,
    };

    // 添加到数据列表
    dailyReportData.value.push(newReport);

    // 同步更新同一周的其他记录的周总结
    syncWeekSummary(newReport.weekNumber, newReport.weekSummary);

    // 关闭对话框并重置表单
    showAddDialog.value = false;
    resetAddForm();

    // 新增后重置到第一页，确保用户能看到新增的记录
    currentPage.value = 1;

    ElMessage.success("日报新增成功");
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 表格内新增记录
const handleAddInTable = () => {
  // 先取消所有行的编辑状态
  dailyReportData.value.forEach(item => {
    item.isEditing = false;
    item.isEditingWeekSummary = false;
    // 清除原始数据引用
    if (item.originalData) delete item.originalData;
    if (item.originalWeekSummary) delete item.originalWeekSummary;
  });
  
  // 获取当前日期
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const weekday = getWeekday(todayStr);
  const weekNumber = getWeekNumber(todayStr);
  
  // 查找同一周的其他记录，获取周总结内容
  const sameWeekRecords = dailyReportData.value.filter(item => item.weekNumber === weekNumber && item.weekSummary);
  const weekSummary = sameWeekRecords.length > 0 ? sameWeekRecords[0].weekSummary : '';
  
  // 创建新的记录对象
  const newRecord = {
    id: Date.now(),
    date: todayStr,
    weekday: weekday,
    content: '',
    weekSummary: weekSummary,
    remarks: '',
    weekNumber: weekNumber,
    isEditing: true,
    isEditingWeekSummary: false
  };
  
  // 添加到数据源（使用push而不是unshift，后续会排序）
  dailyReportData.value.push(newRecord);
  
  // 重置到第一页，确保用户能看到新增的记录
  currentPage.value = 1;
  
  // 重新计算合并单元格
  nextTick(() => {
    calculateSpan(filteredReportData.value);
  });
};

// 处理日期变化
const handleDateChange = (row) => {
  if (row.date) {
    // 保存旧的周数
    const oldWeekNumber = row.weekNumber;
    
    // 更新星期
    row.weekday = getWeekday(row.date);
    // 更新周数
    row.weekNumber = getWeekNumber(row.date);
    
    // 如果周数发生变化，查找新周的周总结内容
    if (row.weekNumber !== oldWeekNumber) {
      // 查找同一周的其他记录，获取周总结内容
      const sameWeekRecords = dailyReportData.value.filter(item => item.weekNumber === row.weekNumber && item.weekSummary);
      if (sameWeekRecords.length > 0) {
        row.weekSummary = sameWeekRecords[0].weekSummary;
        // 同步更新同一周的其他记录
        syncWeekSummary(row.weekNumber, row.weekSummary);
      } else {
        // 如果新周没有周总结，清空当前行的周总结
        row.weekSummary = '';
      }
    }
    
    // 重新计算合并单元格
    nextTick(() => {
      calculateSpan(filteredReportData.value);
    });
  }
};

// 处理搜索
const handleSearch = () => {
  // 搜索时重置到第一页
  currentPage.value = 1;
  nextTick(() => {
    calculateSpan(filteredReportData.value);
  });
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  nextTick(() => {
    calculateSpan(filteredReportData.value);
  });
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  nextTick(() => {
    calculateSpan(filteredReportData.value);
  });
};

// 删除功能数据
const showDeleteDialog = ref(false);
const deleteForm = ref({ date: "" });
let currentDeleteId = null;

// 处理删除按钮点击
const handleDelete = (row) => {
  deleteForm.value.date = row.date;
  currentDeleteId = row.id;
  showDeleteDialog.value = true;
};

// 确认删除
const confirmDelete = async () => {
  try {
    // 查找并删除记录
    const index = dailyReportData.value.findIndex(
      (item) => item.id === currentDeleteId
    );
    if (index > -1) {
      const deletedWeekNumber = dailyReportData.value[index].weekNumber;
      dailyReportData.value.splice(index, 1);

      // 重新计算合并单元格
      await nextTick();
      calculateSpan(filteredReportData.value);

      ElMessage.success("日报删除成功");

      // 如果当前页没有数据了，跳转到上一页
      if (allFilteredReportData.value.length === 0) {
        currentPage.value = 1;
      } else if (
        (currentPage.value - 1) * pageSize.value >=
        allFilteredReportData.value.length
      ) {
        currentPage.value--;
      }
    }

    showDeleteDialog.value = false;
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败，请重试");
  }
};

// 行内编辑相关方法
// 开始编辑（整行编辑，内容和备注）
const handleStartEdit = (row) => {
  // 先取消所有行的编辑状态
  dailyReportData.value.forEach(item => {
    item.isEditing = false;
    item.isEditingWeekSummary = false;
    // 清除原始数据引用
    if (item.originalData) delete item.originalData;
    if (item.originalWeekSummary) delete item.originalWeekSummary;
  });
  
  // 记录原始数据，用于取消编辑时恢复
  row.originalData = {
    content: row.content,
    remarks: row.remarks,
    date: row.date,
    weekSummary: row.weekSummary,
    weekNumber: row.weekNumber
  };
  row.isEditing = true;
};

// 保存编辑
const handleSaveEdit = async (row) => {
  // 简单验证
  if (!row.content || row.content.length < 10) {
    ElMessage.warning("内容不能少于10个字符");
    return;
  }

  // 更新数据
  const index = dailyReportData.value.findIndex((item) => item.id === row.id);
  if (index > -1) {
    // 保存旧的周数
    const oldWeekNumber = dailyReportData.value[index].weekNumber;
    
    // 直接更新对象属性，确保Vue响应式系统能正确检测到变化
    dailyReportData.value[index].content = row.content;
    dailyReportData.value[index].remarks = row.remarks || "";
    dailyReportData.value[index].date = row.date;
    dailyReportData.value[index].weekday = row.weekday;
    dailyReportData.value[index].weekNumber = row.weekNumber;
    dailyReportData.value[index].weekSummary = row.weekSummary;
    dailyReportData.value[index].isEditing = false;

    // 删除原始数据引用
    if (row.originalData) {
      delete row.originalData;
    }

    // 如果周数发生变化或周总结修改，同步更新同一周的其他记录
    if (oldWeekNumber !== row.weekNumber || 
        dailyReportData.value[index].weekSummary !== row.originalData.weekSummary) {
      syncWeekSummary(row.weekNumber, row.weekSummary);
    }

    // 重新计算合并单元格
    await nextTick();
    calculateSpan(filteredReportData.value);

    ElMessage.success("日报更新成功");
  }
};

// 取消编辑
const handleCancelEdit = (row) => {
  // 判断是否为新增记录（新增记录没有originalData）
  if (!row.originalData) {
    // 是新增记录，从数据列表中删除
    const index = dailyReportData.value.findIndex(item => item.id === row.id);
    if (index > -1) {
      dailyReportData.value.splice(index, 1);
    }
  } else {
    // 是现有记录，恢复原始数据
    row.content = row.originalData.content;
    row.remarks = row.originalData.remarks;
    row.date = row.originalData.date;
    row.weekday = getWeekday(row.originalData.date);
    row.weekNumber = row.originalData.weekNumber;
    row.weekSummary = row.originalData.weekSummary;
    delete row.originalData;
    row.isEditing = false;
  }
  
  // 重新计算合并单元格
  nextTick(() => {
    calculateSpan(filteredReportData.value);
  });
};

// 编辑周总结（点击单元格）
const handleEditWeekSummary = (row) => {
  // 如果已经在整行编辑状态，直接返回
  if (row.isEditing) {
    return;
  }
  
  // 先取消所有行的编辑状态
  dailyReportData.value.forEach(item => {
    item.isEditing = false;
    item.isEditingWeekSummary = false;
    // 清除原始数据引用
    if (item.originalData) delete item.originalData;
    if (item.originalWeekSummary) delete item.originalWeekSummary;
  });
  
  // 记录原始数据，用于取消编辑时恢复
  row.originalWeekSummary = row.weekSummary;
  
  // 进入周总结编辑状态
  row.isEditingWeekSummary = true;
};

// 保存周总结编辑 - 同步更新同一周的所有记录
const handleSaveWeekSummary = async (row) => {
  // 简单验证
  if (!row.weekSummary || row.weekSummary.length < 5) {
    ElMessage.warning("周总结不能少于5个字符");
    return;
  }

  // 同步更新同一周的所有记录
  syncWeekSummary(row.weekNumber, row.weekSummary);

  // 更新当前行状态
  row.isEditingWeekSummary = false;
  
  // 删除原始数据引用
  if (row.originalWeekSummary) {
    delete row.originalWeekSummary;
  }

  // 重新计算合并单元格
  await nextTick();
  calculateSpan(filteredReportData.value);

  ElMessage.success("周总结更新成功");
};

// 取消周总结编辑
const handleCancelEditWeekSummary = (row) => {
  // 恢复原始数据
  if (row.originalWeekSummary) {
    row.weekSummary = row.originalWeekSummary;
    delete row.originalWeekSummary;
  }
  row.isEditingWeekSummary = false;
};

// 计算合并单元格的规则 - 接收当前数据
const calculateSpan = (data) => {
  spanArr.value = [];
  position.value = 0;

  const currentData = data || filteredReportData.value;

  for (let i = 0; i < currentData.length; i++) {
    if (i === 0) {
      spanArr.value.push(1);
      position.value = 0;
    } else {
      // 判断当前行与前一行是否为同一周且周总结相同
      if (currentData[i].weekNumber === currentData[i - 1].weekNumber && 
          currentData[i].weekSummary === currentData[i - 1].weekSummary &&
          currentData[i].weekSummary) {
        spanArr.value[position.value] += 1;
        spanArr.value.push(0);
      } else {
        spanArr.value.push(1);
        position.value = i;
      }
    }
  }
};

// 合并单元格的方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 只处理周总结列（索引为3）
  if (columnIndex === 3) {
    // 确保索引在有效范围内
    if (rowIndex >= 0 && rowIndex < spanArr.value.length) {
      const _row = spanArr.value[rowIndex];
      const _col = _row > 0 ? 1 : 0;
      return { rowspan: _row, colspan: _col };
    }
    return { rowspan: 1, colspan: 1 };
  }
};

// 监听数据变化，重新计算合并规则
watch(
  () => dailyReportData.value,
  () => {
    nextTick(() => {
      calculateSpan(filteredReportData.value);
    });
  },
  { deep: true }
);

// 组件挂载时计算合并规则
onMounted(() => {
  calculateSpan(allFilteredReportData.value.slice(0, pageSize.value));
});
</script>

<style scoped>
.daily-work-report {
  min-height: 100vh;
  padding: 20px;
}

.operation-area {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.table-operation-area {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.result-info {
  margin-bottom: 15px;
  color: #606266;
  font-size: 14px;
}

:deep(.el-table__header-wrapper th) {
  background-color: #ebf4fb !important;
  font-weight: 600;
  color: #303133;
}

:deep(.el-table__body-wrapper tr:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-button) {
  margin-bottom: 10px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 优化周总结单元格样式 */
:deep(.el-table-column--index-3 .el-table__cell) {
  vertical-align: middle !important;
  cursor: pointer;
}

:deep(.el-table-column--index-3 .el-table__cell:hover) {
  background-color: #f0f7ff;
}
</style>