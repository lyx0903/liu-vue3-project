<!-- 响应式基础 -->
<!-- 
ref():可以持有任何类型的值(创建响应式的基本类型值),访问需要加 .value，模板中不用加
reactive():用于创建响应式的对象(只能用于对象类型不能持有原始类型)，直接访问和修改属性，无需.value
computed():创建基于其他响应式数据的计算属性,自动追踪依赖并缓存结果,只有当依赖发生变化时才会重新计算
-->

<template>
  <button @click="count++">{{ count }}</button>
  <button @click="increment">{{ count1 }}</button>

  <button @click="state.count++">{{ state.count }}</button>

  <!-- 计算属性 -->
  <p>Has published books:</p>
  <span>{{ author.books.length > 0 ? "Yes" : "No" }}</span>

  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>

  <!-- 
  v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染。
  使用 v-else 为 v-if 添加一个“else 区块”。
    -->
  <!-- <h1 v-if="awesome">Vue is awesome!</h1> -->

  <button @click="awesome = !awesome">Toggle</button>
  <h2 v-if="awesome">Vue is awesome!</h2>
  <h2 v-else>Oh no 😢</h2>

  <h1 v-show="ok">Hello!</h1>

  <!-- 
  v-for="item in items"  v-for 是基于一个数组来渲染一个列表，items 是源数据的数组，而 item 是迭代项的别名。
  支持使用可选的第二个参数表示当前项的位置索引
  -->
  <div v-for="item in team">{{ item.name }}</div>
  <div v-for="item in team">{{ item.role }}</div>
  <div v-for="(item, index) in team">{{ index }} - {{ item.name }}</div>

  <!-- v-for 遍历一个对象的所有属性(可以通过提供第二个参数表示属性名 ,第三个参数表示位置索引) -->
  <ul v-for="(value, key, index) in product">
    <li>{{ index }} {{ key }} : {{ value }}</li>
  </ul>

  <span v-for="n in 10">{{ n }}</span>

  <!-- Class 与 Style 绑定 -->
  <!-- 1.绑定 HTML class -->
  <!-- 绑定对象：可以给 :class (v-bind:class 的缩写) 传递一个对象来动态切换 class -->
  <div :class="{ active: isActive }"></div>
  <div :class="classObject"></div>

  <!-- 2.绑定内联样式 -->
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const count = ref(0);

const count1 = ref(0);
function increment() {
  count1.value++;
}

const state = reactive({ count: 0 });

const author = reactive({
  name: "John Doe",
  books: [
    "Vue 2 - Advanced Guide",
    "Vue 3 - Basic Guide",
    "Vue 4 - The Mystery",
  ],
});
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? "yes" : "no";
});

const awesome = ref(true);
const ok = ref(true);

const team = reactive([
  { name: "张三", role: "前端开发", bio: "专注于Vue和React开发" },
  { name: "李四", role: "UI设计师", bio: "创造美观且易用的界面" },
  { name: "王五", role: "后端开发", bio: "确保系统稳定和高性能" },
]);

const product = reactive({
  name: "Vue 3 UI框架",
  description: "基于Vue 3的现代化UI框架",
  price: "免费",
});

const isActive = ref(true);
const hasError = ref(false);
const error = ref(null);
// const classObject = computed(() => {});
</script>
