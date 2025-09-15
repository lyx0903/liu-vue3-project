<template>
  <el-dialog
    v-model="addDialogObj.show"
    :title="addDialogObj.title"
    :width="addDialogObj.width"
  >
    <el-form :model="form" ref="addFormRef" :rules="rules" label-width="80px">
      <!-- prop 必须与 rules 中的 key 一致 -->
      <el-form-item label="班级编号" prop="classId">
        <el-input v-model="form.classId" />
      </el-form-item>
      <el-form-item label="名称" prop="className">
        <el-input v-model="form.className" />
      </el-form-item>
      <el-form-item label="班主任" prop="headTeacher">
        <el-select v-model="form.headTeacher" clearable>
          <el-option
            v-for="item in headTeacherOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学生数" prop="studentCount">
        <el-input-number
          v-model="form.studentCount"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="类型" prop="classType">
        <el-select v-model="form.classType" clearable>
          <el-option label="实验班" value="实验班" />
          <el-option label="平行班" value="平行班" />
        </el-select>
      </el-form-item>
      <el-form-item label="平均分" prop="averageScore">
        <el-input-number
          v-model="form.averageScore"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="荣誉" prop="awards">
        <el-select v-model="form.awards" multiple clearable>
          <el-option label="省级优秀班集体" value="省级优秀班集体" />
          <el-option label="市级优秀班级" value="市级优秀班级" />
          <el-option label="校级优秀班级" value="校级优秀班级" />
          <el-option label="校级文明班级" value="校级文明班级" />
          <el-option label="运动会团体总分第一" value="运动会团体总分第一" />
          <el-option label="学科竞赛团体奖" value="学科竞赛团体奖" />
          <el-option
            label="科技创新大赛优秀组织奖"
            value="科技创新大赛优秀组织奖"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogObj.show = false">取消 </el-button>
        <el-button type="primary" @click="save"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios"; //引入接口
const emits = defineEmits(["addOk"]);

const addFormRef = ref(null);
// 弹窗配置对象
const addDialogObj = reactive({
  title: "新增班级",
  show: false,
  width: 500,
});

// 弹窗表单数据（初始为空）
const form = reactive({
  // classId: "",
  // className: "",
  // headTeacher: "",
  // studentCount: 0,
});

const headTeacherOptions = [
  { name: "张采风", subject: "语文", teachingExperience: 2 },
  { name: "刘亚兴", subject: "数学", teachingExperience: 1 },
  { name: "许泽云", subject: "体育", teachingExperience: 20 },
  { name: "韩冰冰", subject: "生活", teachingExperience: 18 },
];

// 弹窗验证
const rules = reactive({
  classId: [{ required: true, message: "请输入班级编号", trigger: "blur" }],
  className: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
  headTeacher: [
    { required: true, message: "请选择班主任姓名", trigger: "blur" },
  ],
  studentCount: [
    { required: true, message: "请输入学生数", trigger: "blur" },
    {
      type: "number",
      min: 20,
      max: 100,
      message: "学生数在20-100之间",
      trigger: "blur",
    },
  ],
  classType: [{ required: true, message: "请选择班级类型", trigger: "blur" }],
  description: [{ required: true, message: "请输入班级描述", trigger: "blur" }],
});

const save = async () => {
  const valid = await addFormRef.value.validate();

  const teacherObj = headTeacherOptions.find((item) => {
    return form.headTeacher === item.name;
  });

  const time =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDay();

  if (valid) {
    axios
      .post("/api/getClassList", {
        ...form,
        headTeacher: teacherObj,
        establishDate: time,
      })
      .then(function (res) {
        // 处理成功情况
        console.log(res);
        ElMessage({ message: "操作成功", type: "success" });
        //成功事件返回emit
        emits("addOk");

        // 成功后关闭弹窗
        addDialogObj.show = false;
      })
      .catch(function (error) {
        // 处理错误情况
        console.log(error);
      })
      .finally(function () {
        // 总是会执行
      });
  } else {
    console.log("error submit!", fields);
  }
};

// 暴露给父组件的属性和方法
defineExpose({ addDialogObj });
</script>
