<template>
  <div class="container">
    <div class="top">
      <div class="card Overview">
        <h2>今日总览</h2>
        <div class="divider"></div>
        <div class="Overview-item">
          <div class="statistic" v-for="item in statistic">
            <div class="title">{{ item.title }}</div>
            <div class="number">{{ item.number }}</div>
          </div>
        </div>
      </div>
      <div class="card sign-in">
        <div class="btns">
          <el-button type="primary" @click="signIn">签到</el-button>
          <el-button type="primary" @click="signOut">签退</el-button>
        </div>
        <div class="divider"></div>
        <div class="time">
          <p>签到时间：09:00:00</p>
          <p>签退时间：17:00:00</p>
        </div>
      </div>
    </div>
    <div class="card state">
      <h2>在岗状态</h2>
      <div class="divider"></div>
      <div class="state-item">
        <div class="qian">
          <h3>前端</h3>
          <div class="qian-item">
            <div class="person">
              <div class="msg">
                <el-avatar :icon="UserFilled" />
                <div class="person-msg">
                  <div class="name">
                    张三 <span style="font-size: 12px; color: #999">Vue3</span>
                  </div>
                  <div class="state">在岗</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="person-time">
                <p>签到时间：09:00:00</p>
                <p>签退时间：17:00:00</p>
              </div>
            </div>
            <div class="person">
              <div class="msg">
                <el-avatar :icon="UserFilled" />
                <div class="person-msg">
                  <div class="name">
                    张三 <span style="font-size: 12px; color: #999">Vue3</span>
                  </div>
                  <div class="state">在岗</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="person-time">
                <p>签到时间：09:00:00</p>
                <p>签退时间：17:00:00</p>
              </div>
            </div>
            <div class="person">
              <div class="msg">
                <el-avatar :icon="UserFilled" />
                <div class="person-msg">
                  <div class="name">
                    张三 <span style="font-size: 12px; color: #999">Vue3</span>
                  </div>
                  <div class="state">在岗</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="person-time">
                <p>签到时间：09:00:00</p>
                <p>签退时间：17:00:00</p>
              </div>
            </div>
            <div class="person">
              <div class="msg">
                <el-avatar :icon="UserFilled" />
                <div class="person-msg">
                  <div class="name">
                    张三 <span style="font-size: 12px; color: #999">Vue3</span>
                  </div>
                  <div class="state">在岗</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="person-time">
                <p>签到时间：09:00:00</p>
                <p>签退时间：17:00:00</p>
              </div>
            </div>
            <div class="person">
              <div class="msg">
                <el-avatar :icon="UserFilled" />
                <div class="person-msg">
                  <div class="name">
                    张三 <span style="font-size: 12px; color: #999">Vue3</span>
                  </div>
                  <div class="state">在岗</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="person-time">
                <p>签到时间：09:00:00</p>
                <p>签退时间：17:00:00</p>
              </div>
            </div>
            <div class="person">
              <div class="msg">
                <el-avatar :icon="UserFilled" />
                <div class="person-msg">
                  <div class="name">
                    张三 <span style="font-size: 12px; color: #999">Vue3</span>
                  </div>
                  <div class="state">在岗</div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="person-time">
                <p>签到时间：09:00:00</p>
                <p>签退时间：17:00:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <div class="card">
          <h2>在岗时间</h2>
          <div class="divider"></div>
          <div class="charts" ref="barChartRef"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <h2>签到情况</h2>
          <div class="divider"></div>
          <el-table :data="tableData" style="width: 100%; height: 300px">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="timeSignIn" label="签到时间" />
            <el-table-column prop="timeSignOut" label="签退时间" />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// import { useTemplateRef } from "vue";
import { UserFilled } from "@element-plus/icons-vue";
import * as echarts from "echarts"; // 引入ECharts

// 今日总览数据
const statistic = [
  { key: "totalPeople", title: "总人数", number: 20 },
  { key: "onDutyPeople", title: "在岗人数", number: 15 },
  { key: "leavePeople", title: "请假人数", number: 5 },
  { key: "signedInPeople", title: "已签到人数", number: 15 },
];

// 签到
const signIn = () => {
  // 1. 检查是否已签到
  if (tableData.some((item) => item.id === id)) {
    ElMessage.error("您已签到，无需重复操作");
    return;
  }
  // 2. 更新数据
  tableData.push({
    id,
    name,
    timeSignIn: new Date().toLocaleTimeString(),
    timeSignOut: "",
  });
  // 3. 刷新表格
  ElMessage.success("签到成功");
};

// 签退
const signOut = () => {
  // 1. 检查是否已签退
  if (!tableData.some((item) => item.id === id)) {
    ElMessage.error("您未签到，无需签退操作");
    return;
  }
  // 2. 更新数据
  tableData.forEach((item) => {
    if (item.id === id) {
      item.timeSignOut = new Date().toLocaleTimeString();
    }
  });
  // 3. 刷新表格
  ElMessage.success("签退成功");
};






const tableData = [
  {
    id: 1,
    name: "张三",
    timeSignIn: "08:55:30",
    timeSignOut: "17:05:15",
  },
  {
    id: 2,
    name: "李四",
    timeSignIn: "09:00:00",
    timeSignOut: "17:30:00",
  },
  {
    id: 3,
    name: "王五",
    timeSignIn: "08:45:10",
    timeSignOut: "16:50:20",
  },
  {
    id: 4,
    name: "赵六",
    timeSignIn: "09:10:05",
    timeSignOut: "18:00:00",
  },
  {
    id: 5,
    name: "孙七",
    timeSignIn: "08:50:00",
    timeSignOut: "17:15:45",
  },
  {
    id: 6,
    name: "周八",
    timeSignIn: "09:05:20",
    timeSignOut: "17:45:30",
  },
  {
    id: 7,
    name: "吴九",
    timeSignIn: "08:58:40",
    timeSignOut: "17:10:10",
  },
  {
    id: 8,
    name: "郑十",
    timeSignIn: "09:02:15",
    timeSignOut: "17:25:50",
  },
];

const barChartRef = useTemplateRef("barChartRef");
// 2. 存储图表实例（避免全局污染，便于销毁）
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
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.top {
  display: flex;
  gap: 20px;
}

.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  // height: 100%;
  .divider {
    margin: 10px 0;
    width: 100%;
    height: 1px;
    background-color: #ddd;
  }
  .Overview-item {
    display: flex;
    gap: 10px;

    .statistic {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
      justify-content: center;

      .title {
        font-size: 14px;
        color: #999;
      }
      .number {
        font-size: 30px;
        font-weight: bold;
      }
    }
  }
}
p {
  font-size: 12px;
  margin: 0px;
  color: #999;
}

.Overview {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.sign-in {
  display: flex;
  flex-direction: column;

  .btns {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .el-button {
      width: 100%;
      margin-left: 0px;
    }
  }
  .time {
    display: flex;
    gap: 10px;
  }
}

.qian-item {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.person {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;

  .msg {
    display: flex;
    gap: 15px;
    align-items: center;

    .person-msg {
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: baseline;
      .name {
        font-size: 16px;
        font-weight: bold;
      }
      .state {
        font-size: 12px;
        color: #999;
      }
    }
  }
  .person-time {
    display: flex;
    gap: 20px;
    justify-content: space-between;
  }
}

.charts {
  width: 100%;
  height: 300px;
}
</style>
