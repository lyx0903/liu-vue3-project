<!-- 
watch() 函数是 Vue 3 中用于侦听响应式数据变化的核心函数
watch(source, callback, options) 
1. 第一个参数：侦听源 (source)--可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组；
【ref 可以直接传递值也可使用 getter 函数，reactive 需要使用 getter 函数实现响应式传递】
2. 第二个参数：回调函数 (callback)--接收 newValue、oldValue 和 onCleanup
  watch(source, (newValue, oldValue, onCleanup) => {
  // newValue: 变化后的新值
  // oldValue: 变化前的旧值
  // onCleanup: 清理函数（用于清除副作用）
})
3. 第三个参数：配置选项 (options)--控制执行时机、深度侦听等行为
  watch(source, callback, {
  immediate: false,    // 是否立即执行
  deep: false,         // 是否深度侦听
  flush: 'pre',        // 回调触发时机
  once: false,         // 是否只执行一次
  onTrack(e) {         // 调试：依赖被追踪时
    debugger
  },
  onTrigger(e) {       // 调试：依赖触发回调时
    debugger
  }
})
-->
<template>
  <div class="wrap">
    <h2>{{ title }}</h2>

    <p>
      Ask a yes/no question:
      <!-- 加载时禁用输入框 -->
      <input type="text" v-model="question" :disabled="loading" />
    </p>
    <p>{{ answer }}</p>

    <!-- 表单 -->
    <div class="form-container">
      <div class="item">
        <label for="name">姓名:</label>
        <input type="text" v-model="form.name" id="name" />
        <span class="error-message" v-show="errors.name">{{
          errors.name
        }}</span>
      </div>
      <div class="item">
        <label>性别:</label>
        <label>
          <input type="radio" v-model="form.sex" value="男" />
          <span>男</span>
        </label>
        <label>
          <input type="radio" v-model="form.sex" value="女" />
          <span>女</span>
        </label>
        <span class="error-message" v-show="errors.sex">{{ errors.sex }}</span>
      </div>
      <div class="item">
        <label for="age">年龄</label>
        <input type="number" v-model="form.age" id="age" />
        <span class="error-message" v-show="errors.age">{{ errors.age }}</span>
      </div>
      <div class="item">
        <label for="tell">手机号：</label>
        <input type="tel" v-model="form.tell" id="tell" />
        <span class="error-message" v-show="errors.tell">{{
          errors.tell
        }}</span>
      </div>
      <button @click="submitForm">提交</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
const title = ref("侦听器");

const answer = ref("问题通常包含一个问号");
const question = ref("");
const loading = ref(false);
// 侦听question的变化
watch(question, async (newQuestion, oldQuestion) => {
  // 当question的值发生变化时执行这个函数
  if (newQuestion.includes("?")) {
    loading.value = true;
    answer.value = "Thinking...";
    try {
      // 尝试调用API
      const res = await fetch("https://yesno.wtf/api"); // 发送GET请求到YesNo API，等待响应
      answer.value = (await res.json()).answer; // 解析JSON响应，获取answer字段的值
    } catch (error) {
      // 如果发生错误（如网络问题）
      answer.value = "Error! Could not reach the API. " + error; // 显示错误信息
    } finally {
      // 无论成功或失败都会执行
      loading.value = false; // 结束加载状态
    }
  }
});

// 表单验证
const form = reactive({
  name: "",
  sex: "",
  age: "",
  tell: "",
});
const errors = reactive({
  name: "",
  sex: "",
  age: "",
  tell: "",
});

// 姓名验证（对于 reactive 创建的响应式对象，写成箭头函数为了实现响应式数据监听，直接写 form.name 会返回一个普通值；如果是 ref ，直接写 form.value.name ）
watch(
  () => form.name,
  (newVal) => {
    const trimmedVal = newVal.trim();
    if (!trimmedVal) {
      errors.name = "姓名不能为空";
    } else if (trimmedVal.length < 2) {
      errors.name = "姓名至少需要2个字符";
    } else if (trimmedVal.length > 10) {
      errors.name = "姓名不能超过10个字符";
    } else {
      errors.name = "";
    }
  }
);

// 性别验证
watch(
  () => form.sex,
  (newVal) => {
    if (!newVal) {
      errors.sex = "请选择性别";
    } else {
      errors.sex = "";
    }
  }
);

// 验证年龄
watch(
  () => form.age,
  (newVal) => {
    if (!newVal || newVal < 1 || newVal > 100) {
      errors.age = "请输入有效的年龄";
    }
  }
);

// 验证电话
watch(
  () => form.tell,
  (newVal) => {
    const trimmedVal = newVal.trim();
    if (!trimmedVal) {
      errors.tell = "电话不能为空";
      return;
    }
    if (!/^[0-9]{11}$/.test(trimmedVal)) {
      errors.tell = "请输入有效的11位手机号";
    } else {
      errors.tell = "";
    }
  }
);

// 提交
const submitForm = () => {
  // 检查是否有误
  const hasError = Object.values(errors).some((error) => error !== "");
  if (!hasError) {
    console.log(form);
    resetForm();
  } else {
    console.log("验证失败", errors);
  }
};

const resetForm = () => {
  Object.keys(form).forEach((element) => {
    form[element] = "";
  });
};
</script>

<!-- 未完成：年龄验证需完善；取消输入时自动触发验证-->
<!-- Object.keys(form) 获取form中的所有键 -->
