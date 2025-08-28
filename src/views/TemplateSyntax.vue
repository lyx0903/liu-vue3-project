<!-- 模板语法 -->
<template>
  <div class="wrap">
    <!-- 文本插值 -->
    <h2>{{ title }}</h2>
    <div>{{ sex === 1 ? "男" : "女" }}</div>
    <div>
      危险程度：{{
        wxcd === 1 ? "严重" : wxcd === 2 ? "警告" : wxcd === 3 ? "一般" : "-"
      }}
    </div>

    <!-- v-html 指令 -->
    <div v-html="rawHtml"></div>

    <!-- Attribute 属性绑定 -->
    <div v-bind:style="color">123</div>
    <div :style="color">123</div>
    <div style="background: pink">123</div>
    <div v-bind="objectOfAttrs">111</div>

    <!-- 调用函数 -->
    <div>
      {{ getName("刘") }}
    </div>
    <div>
      {{ getName() }}
    </div>

    <!-- 指令 Directives -->
    <p v-if="seen">Now you see me</p>
  </div>
</template>

<script setup>
const title = "模板语法";
const sex = 1;
const wxcd = 2;

const rawHtml = `
<ul>
  <li>1</li>
  <li>2</li>
</ul>
`;

const color = "background:pink";
const objectOfAttrs = {
  id: "container",
  class: "wrapper",
  style: "background-color:green",
};

const getName = (xing) => {
  if (xing) {
    return `${xing}亚兴`;
  } else {
    return "许泽云";
  }
};

const seen = true;
</script>
