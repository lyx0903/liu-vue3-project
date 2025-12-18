<template>
  <div class="cont">
    <div class="cards">
      <el-card shadow="never" v-for="(item, index) in cardTop" :key="index">
        <div class="title">
          <span>{{ item.title }}</span>
          <el-icon class="icons">{{ item.icon }}</el-icon>
        </div>
        <div class="val">{{ item.value }}</div>
        <div class="des">{{ item.des }}</div>
      </el-card>
    </div>
    <div class="cards">
      <el-card shadow="never">
        <h2>柱状图</h2>
        <div class="charts" ref="barChartRef"></div>
      </el-card>
      <el-card shadow="never">
        <h2>饼图</h2>
        <div class="charts" ref="pieChartRef"></div>
      </el-card>
      <el-card shadow="never">
        <h2>折线图</h2>
        <div class="charts" ref="lineChartRef"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, useTemplateRef, onMounted } from "vue";
import * as echarts from "echarts"; // 引入ECharts

// 头部卡片数据
const cardTop = ref([
  { title: "在线基站数", value: "4", des: "正常运行设备", icon: "RiGift2Line" },
  { title: "故障基站数", value: "1", des: "需维修设备", icon: "warning" },
  {
    title: "今日新增基站",
    value: "2",
    des: "24小时内新增",
    icon: "plus-circle",
  },
  { title: "基站利用率", value: "78%", des: "当前负载比例", icon: "pie-chart" },
  {
    title: "平均响应时间",
    value: "32ms",
    des: "设备数据传输延迟",
    icon: "clock",
  },
  {
    title: "覆盖区域数",
    value: "12",
    des: "已覆盖的行政区域",
    icon: "map-marker",
  },
  { title: "本月维护次数", value: "8", des: "计划性维护记录", icon: "wrench" },
  { title: "告警次数", value: "3", des: "今日设备异常告警", icon: "bell" },
]);

const barChartRef = useTemplateRef("barChartRef");
const pieChartRef = useTemplateRef("pieChartRef"); // 获取DOM容器的引用
const lineChartRef = useTemplateRef("lineChartRef");

// 2. 存储图表实例（避免全局污染，便于销毁）
let chartInstances = {
  bar: null,
  line: null,
  pie: null,
};

const barChartOption = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow", // 阴影指示器，用于柱状图
    },
  },
  grid: {
    left: "2%",
    right: "2%",
    bottom: "2%",
    top: "4%",
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
  ],
});
const pieChartOption = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "right",
    orient: "vertical",
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },

      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
});
const lineChartOption = reactive({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Email", "Unio", "Video", "Direct", "Search"],
    top: 0,
    right: 0,
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "4%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "Unio",
      type: "line",
      stack: "Total",
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "Video",
      type: "line",
      stack: "Total",
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "Direct",
      type: "line",
      stack: "Total",
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "Search",
      type: "line",
      stack: "Total",
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
});

onMounted(() => {
  // 初始化柱状图
  chartInstances.bar = echarts.init(barChartRef.value);
  chartInstances.bar.setOption(barChartOption);

  // 初始化折线图
  chartInstances.line = echarts.init(lineChartRef.value);
  chartInstances.line.setOption(lineChartOption);

  // 初始化饼图
  chartInstances.pie = echarts.init(pieChartRef.value);
  chartInstances.pie.setOption(pieChartOption);
});
</script>

<style lang="scss" scoped>
.cont {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cards {
  display: grid;
  /* 自适应列：最小 100px，最大占满剩余空间（响应式常用） */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  .title {
    font-size: 14px;
    color: #333;
    display: flex;
    gap: 10px;
    span {
      flex: 1;
    }
    .icons {
      color: #1890ff;
    }
  }
  .val {
    font-size: 24px;
  }
  .des {
    color: #999;
    font-size: 12px;
  }
}
h2 {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 0;
}
.charts {
  width: 100%;
  height: 200px; // 必须设置高度，否则图表无法显示
}
</style>
