<template>
  <div class="home">
    <div class="statistics">
      <div
        class="item"
        v-for="item in statisticsData"
        :key="item.title"
        :style="{ backgroundColor: item.color }"
      >
        <div class="left">
          <div class="number">{{ item.number }}</div>
          <div class="text">{{ item.title }}</div>
        </div>
        <div class="right">
          <el-icon :icon="item.icon"></el-icon>
        </div>
      </div>
    </div>

    <div class="chart">
      <div class="chart-item">
        <div class="title">
          <h2>柱状图</h2>
          <el-input
            placeholder="请输入"
            v-model="searchText"
            clearable
            :suffix-icon="Search"
            style="width: 200px"
          ></el-input>
        </div>
        <div class="divider"></div>
        <!-- 图表必须设置高度才能显示 -->
        <div class="barRef" ref="barChartRef"></div>
      </div>
      <div class="chart-item">
        <h2>使用top5</h2>
        <div class="divider"></div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="module" label="模块" align="center" />
          <el-table-column prop="function" label="功能" align="center" />
          <el-table-column prop="number" label="累计次数" align="center" />
        </el-table>
      </div>
    </div>

    <div class="row3">
      <div class="chart-item">
        <div class="title">
          <h2>柱状图</h2>
          <el-input
            placeholder="请输入"
            v-model="searchText"
            clearable
            :suffix-icon="Search"
            style="width: 200px"
          ></el-input>
        </div>
        <div class="divider"></div>
        <!-- 图表必须设置高度才能显示 -->
        <div class="barRef" ref="barChartRef"></div>
      </div>
      <div class="chart-item">
        <div class="title">
          <h2>柱状图</h2>
          <el-input
            placeholder="请输入"
            v-model="searchText"
            clearable
            :suffix-icon="Search"
            style="width: 200px"
          ></el-input>
        </div>
        <div class="divider"></div>
        <!-- 图表必须设置高度才能显示 -->
        <div class="barRef" ref="barChartRef"></div>
      </div>
      <div class="chart-item">
        <div class="title">
          <h2>柱状图</h2>
          <el-input
            placeholder="请输入"
            v-model="searchText"
            clearable
            :suffix-icon="Search"
            style="width: 200px"
          ></el-input>
        </div>
        <div class="divider"></div>
        <!-- 图表必须设置高度才能显示 -->
        <div class="barRef" ref="barChartRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts"; // 引入ECharts

const statisticsData = [
  { title: "用户总数", number: 123, icon: "UserFilled", color: "#409eff" },
  { title: "订单总数", number: 456, icon: "order", color: "#e6a23c" },
  { title: "商品总数", number: 789, icon: "product", color: "#67c23a" },
  { title: "类目总数", number: 789, icon: "category", color: "#904e95" },
  { title: "订单总数", number: 456, icon: "order", color: "#546e7a" },
];

const tableData = [
  { module: "用户模块", function: "用户登录", number: 123 },
  { module: "订单模块", function: "创建订单", number: 456 },
  { module: "商品模块", function: "查询商品", number: 789 },
  { module: "商品模块", function: "查询商品", number: 789 },
  { module: "商品模块", function: "查询商品", number: 789 },
];

const barChartRef = useTemplateRef("barChartRef");
let chartInstances = {
  bar: null,
};
const barChartOption = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      //type: "shadow", // 阴影指示器，用于柱状图
    },
  },
  grid: {
    left: "2%",
    right: "2%",
    bottom: "2%",
    top: "8%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
    {
      data: [100, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
});
onMounted(() => {
  // 初始化柱状图
  chartInstances.bar = echarts.init(barChartRef.value);
  chartInstances.bar.setOption(barChartOption);
});
</script>

<style scoped lang="scss">
.home {
  // margin: -20px;
  box-sizing: border-box;
  overflow-y: auto;

  width: calc(100vw - 240px); /* 视口宽度，减去侧边栏宽度 */
  height: calc(100vh - 40px); /* 视口高度，减去自带的padding */
  background-image: url("public/bg.jpg");
  background-size: cover; /* 背景图覆盖容器 */
  background-repeat: no-repeat; /* 避免图片重复 */
  background-position: center center; /* 背景图居中 */
  background-attachment: fixed; /* 核心：背景固定不滚动 */

  padding: 40px; /* 你的原有内边距 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.statistics {
  display: flex;
  gap: 20px;

  .item {
    flex: 1;
    display: flex;
    gap: 10px;
    padding: 15px;
    border-radius: 10px;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .number {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
      }
      .text {
        font-size: 16px;
        color: #fff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.chart {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.row3 {
  display: flex;
  gap: 20px;
}

.chart-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  flex: 1;
  .title {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;

    h2 {
      flex: 1;
    }
  }

  .divider {
    margin: 10px 0;
    width: 100%;
    height: 1px;
    background-color: #ddd;
  }

  .barRef {
    height: 240px;
  }
}
</style>
