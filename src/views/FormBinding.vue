<template>
  <div class="wrap">
    <div>v-model：表单元素和数据之间创建双向数据绑定</div>

    <!-- 单行文本 -->
    <input v-model="text" />
    <!-- 多行文本 -->
    <textarea v-model="text"></textarea>

    <!-- 复选框 -->
    <input type="checkbox" id="checkbox" v-model="checked" />
    <label for="checkbox">{{ checked }}</label>
    <!-- 复选框组 -->
    <div>Checked name:{{ checkedNames }}</div>
    <input type="checkbox" id="jack" value="jack" v-model="checkedNames" />
    <label for="jack">jack</label>
    <input type="checkbox" id="john" value="john" v-model="checkedNames" />
    <label for="john">john</label>
    <input type="checkbox" id="mike" value="mike" v-model="checkedNames" />
    <label for="mike">mike</label>

    <!-- 单选框 -->
    <div>Picked:{{ picked }}</div>
    <input type="radio" id="one" value="one" v-model="picked" />
    <label for="one">one</label>
    <input type="radio" id="two" value="two" v-model="picked" />
    <label for="two">two</label>

    <!-- 选择器 -->
    <div>Selected: {{ selected }}</div>
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";

const checked = ref(true);

const checkedNames = ref([]); //为什么reactive不行？？？
const picked = ref();
const selected = ref();
</script>
