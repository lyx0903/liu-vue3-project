<template>
  <div class="wrap">
    <h1>组件基础</h1>

    <h2>使用组件--下面的是子组件!</h2>
    <ButtonCounter />
    <ButtonCounter />

    <h2>传递 props</h2>
    <div>{{ a }}</div>
    <BlogPost message="内容直接加在子组件的标签里面" @gun="gun"/>
    <BlogPost v-for="item in props" :key="item.id" :message="item.message" :code="123" />

    <h2>监听事件</h2>
    <h2>通过插槽来分配内容</h2>
    <AlertBox> Something bad happened. </AlertBox>

    <h2>动态组件</h2>
    <!-- currentTab 改变时组件也改变 -->
    <button v-for="item in tabs" @click="currentTab = item.name">
      {{ item.name }}
    </button>
    <component :is="tabs[currentTab]"></component>
  </div>
</template>

<script setup>
import { ref } from "vue";

import ButtonCounter from "./ButtonCounter.vue";
import BlogPost from "./BlogPost.vue";
import AlertBox from "./AlertBox.vue";

const props = ref([
  { id: 1, message: "My journey with Vue" },
  { id: 2, message: "Blogging with Vue" },
  { id: 3, message: "Why Vue is so fun" },
]);

const a = ref(6)
const gun = (num)=>{
  alert(num)
}

const currentTab = ref("AlertBox");
const tabs = [
  { component: ButtonCounter, name: "ButtonCounter" },
  { component: BlogPost, name: "BlogPost" },
  { component: AlertBox, name: "AlertBox" },
];
</script>
