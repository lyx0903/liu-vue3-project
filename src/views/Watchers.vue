<template>
  <div class="container">
    <el-card shadow="never" class="cont">
      <h2>监视ref定义的【基本类型】数据</h2>
      <div class="text">当前求和为：{{ sum }}</div>
      <el-button type="primary" @click="changeSum">点我sum+1</el-button>
    </el-card>
    <el-card shadow="never" class="cont">
      <h2>监视ref定义的【对象类型】数据</h2>
      <div class="text">姓名：{{ person.name }}</div>
      <div class="text">年龄：{{ person.age }}</div>
      <div class="btns">
        <el-button type="primary" @click="changeName">改名字</el-button>
        <el-button type="primary" @click="changeAge">改年龄</el-button>
        <el-button type="primary" @click="changePerson">改整个对象</el-button>
      </div>
      <div class="bz">
        <ul>
          <li>
            监视的是对象的地址值，若想监视对象内部属性的变化，需要手动开启深度监视（第三个参数）
          </li>
          <li>
            【对象中的属性】newValue和oldValue都是新值，因为他们是同一个对象
          </li>
          <li>【整个对象】newValue是新，oldValue是旧，因为不是同一个对象</li>
        </ul>
      </div>
    </el-card>
    <el-card shadow="never" class="cont">
      <h2>监视reactive定义的【对象类型】数据</h2>
      <div class="text">姓名：{{ person2.name }}</div>
      <div class="text">年龄：{{ person2.age }}</div>
      <div class="btns">
        <el-button type="primary" @click="changeName2">改名字</el-button>
        <el-button type="primary" @click="changeAge2">改年龄</el-button>
        <el-button type="primary" @click="changePerson2">改整个对象</el-button>
      </div>
      <div class="bz">
        <ul>
          <li>不能整体修改</li>
          <li>默认开启深度监视，无法关闭</li>
          <li>
            修改方式（相当于值覆盖，不是真正意义上的替换）：Object.assign(person,{name:'李四'，age:90})
          </li>
        </ul>
      </div>
    </el-card>
    <el-card shadow="never" class="cont">
      <h2>ref 或 reactive 定义的对象类型的某个属性</h2>
      <div class="text">姓名：{{ person3.name }}</div>
      <div class="text">年龄：{{ person3.age }}</div>
      <div class="text">汽车：{{ person3.car.c1 }}\{{ person3.car.c2 }}</div>
      <div class="btns">
        <el-button type="primary" @click="changeName3">改名字</el-button>
        <!-- <el-button type="primary" @click="changeAge3">改年龄</el-button> -->
        <el-button type="primary" @click="changeC1">改汽车1</el-button>
        <el-button type="primary" @click="changeC2">改汽车2</el-button>
        <el-button type="primary" @click="changeCar">改汽车</el-button>
      </div>
      <div class="bz">
        <ul>
          <li>
            监视的数据是基本类型，需要把第一个参数加工成getter函数（对象返回值），直接写
            person3.name 是监视不到的
          </li>
          <li>
            监视的数据是对象类型，直接写或者写成函数都可以，建议写成函数——直接写
            person3.car 监视的是对象的地址值，监视细枝末节开启深度监听
          </li>
        </ul>
      </div>
    </el-card>
    <el-card shadow="never" class="cont">
      <h2>监视上述多种数据</h2>
      <div class="text">监视情况四的年龄和汽车</div>
      <div class="btns">
        <el-button type="primary" @click="change">改年龄&汽车</el-button>
      </div>
    </el-card>
    <el-card shadow="never" class="cont">
      <h2>watchEffect()</h2>
    
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";

// import { ref, reactive, watch } from "vue";

// 情况一
const sum = ref(0);
const changeSum = () => {
  sum.value += 1;
};
watch(
  sum,
  (newVal, oldVal) => {
    ElMessage.success(`新：${newVal}，旧${oldVal}`);
  },
  { deep: true }
);

// 情况二
const person = ref({
  name: "张三",
  age: 18,
});
const changeName = () => {
  person.value.name += "~";
};
const changeAge = () => {
  person.value.age += 1;
};
const changePerson = () => {
  person.value = { name: "李四", age: 50 };
};
watch(
  person,
  (newVal, oldVal) => {
    const newStr = JSON.stringify(newVal);
    const oldStr = JSON.stringify(oldVal);
    // 只接受字符串，需要先转换成字符串，然后再拼接
    ElMessage.success(`新：${newStr}，旧：${oldStr}`);
  },
  { deep: true }
);

// 情况三
const person2 = reactive({
  name: "张三",
  age: 18,
});
const changeName2 = () => {
  person2.name += "~";
};
const changeAge2 = () => {
  person2.age += 1;
};
const changePerson2 = () => {
  Object.assign(person2, { name: "李四", age: 50 }); //覆盖之前的值
};
watch(
  person2,
  (newVal, oldVal) => {
    const newStr = JSON.stringify(newVal);
    const oldStr = JSON.stringify(oldVal);
    ElMessage.success(`新：${newStr}，旧：${oldStr}`);
  }
  // {deep:true}
);

// 情况四
const person3 = reactive({
  name: "张三",
  age: 18,
  car: {
    c1: "奔驰",
    c2: "宝马",
  },
});
const changeName3 = () => {
  person3.name += "~";
};
const changeC1 = () => {
  person3.car.c1 += "奥迪";
};
const changeC2 = () => {
  person3.car.c2 += "特斯拉";
};
const changeCar = () => {
  // 这里可以直接替换，是因为car是person3的内部属性
  person3.car = { c1: "小米su7", c2: "小米su7 Max" };
};
//监视name，不能直接写 person.name,要加工成getter函数
watch(
  () => person3.name,
  (newVal, oldVal) => {
    const newStr = JSON.stringify(newVal);
    const oldStr = JSON.stringify(oldVal);
    ElMessage.success(`新：${newStr}，旧：${oldStr}`);
  },
  { deep: true }
);
watch(
  () => person3.car,
  (newVal, oldVal) => {
    const newStr = JSON.stringify(newVal);
    const oldStr = JSON.stringify(oldVal);
    ElMessage.success(`新：${newStr}，旧：${oldStr}`);
  },
  { deep: true }
);

// 情况五
const change = () => {
  person3.age += 1;
  person3.car = { c1: "雅迪", c2: "爱玛" };
};
watch(
  [() => person3.age, () => person3.car],
  (newVal, oldVal) => {
    console.log(`新${newVal}，旧${oldVal}`);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.cont {
  width: calc(50% - 20px);
  h2 {
    font-size: 18px;
    margin: 0;
    margin-bottom: 10px;
  }
  .text {
    margin-bottom: 10px;
  }
  .btns {
    margin-bottom: 15px;
  }
  .bz {
    background-color: #f5f5f5;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 2px;
    ul {
      margin: 0;
      li {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
