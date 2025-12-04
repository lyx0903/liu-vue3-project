<template>
  <!-- 主应用容器 -->
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">尊峰环保监管系统</div>
      <div class="header-center">
        <div class="date-weather">{{ formattedDate }} | {{ weatherInfo }}</div>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchQuery"
          placeholder="输入站点名称/省份..."
          class="search-box"
          prefix-icon="Search"
        />
        <div class="user-info" @click="showUserMenu = !showUserMenu">
          <span>
            <el-icon
              style="font-size: 18px; margin-right: 2px; vertical-align: middle"
              ><User
            /></el-icon>
            张三-总部监管部
          </span>
          <el-dropdown v-if="showUserMenu" placement="bottom-end">
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-button
          icon="Setting"
          circle
          class="settings-btn"
          @click="handleSettingsClick"
        />
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-container">
      <!-- 左侧面板 -->
      <aside class="left-panel">
        <!-- 当日处理量 -->
        <el-card class="data-panel panel-green">
          <div class="panel-title">当日处理量</div>
          <div class="panel-value">{{ dailyProcessing }}/10.0 吨</div>
          <div class="progress-container">
            <el-progress
              :percentage="dailyProcessingRate"
              stroke-width="6"
              stroke-linecap="round"
              class="progress-bar"
            />
          </div>
          <div class="panel-desc">完成率: {{ dailyProcessingRate }}%</div>

          <!-- 环比/同比数据 -->
          <div class="comparison-data">
            <div class="comparison-item">
              <div class="panel-desc">日环比</div>
              <div class="comparison-value positive">+2.1%</div>
            </div>
            <div class="comparison-item">
              <div class="panel-desc">周同比</div>
              <div class="comparison-value positive">+5.3%</div>
            </div>
          </div>

          <!-- 趋势图 -->
          <div class="trend-chart">
            <div class="trend-line"></div>
          </div>
        </el-card>

        <!-- 总处理量 -->
        <el-card class="data-panel panel-blue">
          <div class="panel-title">总处理量</div>
          <div class="total-processing">
            <div class="total-value">{{ totalProcessing }} 万吨</div>
            <div class="total-label">2024年累计处理总量</div>
          </div>

          <div class="data-card">
            <div class="data-card-title">月处理量</div>
            <div class="data-card-value">8.9 万吨</div>
            <div class="progress-container">
              <el-progress
                percentage="89"
                stroke-width="6"
                stroke-linecap="round"
                class="progress-bar"
              />
            </div>
          </div>

          <div class="data-card">
            <div class="data-card-title">年处理目标</div>
            <div class="data-card-value">200 万吨</div>
            <div class="progress-container">
              <el-progress
                percentage="92.8"
                stroke-width="6"
                stroke-linecap="round"
                class="progress-bar"
              />
            </div>
          </div>
        </el-card>

        <!-- 排放数据 -->
        <el-card class="data-panel panel-blue">
          <div class="panel-title">排放数据对比</div>
          <div class="panel-value">{{ complianceRate }}% 达标率</div>
          <div class="panel-desc">{{ nonCompliantSites }}个站点超标</div>

          <!-- 国家监管数据 -->
          <div
            class="list-item"
            v-for="(item, index) in emissionData"
            :key="index"
          >
            <span style="color: #e0e0e0">{{ item.name }}:</span>
            <span :class="item.compliant ? 'positive' : 'negative'">
              {{ item.value }}
              <span>({{ item.compliant ? "达标" : "超标" }})</span>
            </span>
          </div>

          <div class="trend-chart" style="margin-top: 10px">
            <div class="trend-line"></div>
          </div>
        </el-card>
      </aside>

      <!-- 中间内容区 -->
      <section class="center-panel">
        <!-- 地图模块 -->
        <div class="map-container">
          <div class="environment-info">数据更新: {{ updateTime }}</div>

          <div class="china-map">
            <!-- 站点标记 -->
            <div
              class="station-marker"
              :class="marker.class"
              :style="marker.style"
              v-for="(marker, index) in stations"
              :key="index"
              @click="showStationPopup(marker)"
            ></div>

            <!-- 站点浮窗 -->
            <el-dialog
              v-model="stationPopupVisible"
              :title="currentStation.name"
              :width="'320px'"
              custom-class="station-popup"
              :close-on-click-modal="false"
            >
              <div class="popup-content">
                <div>
                  状态:
                  <span :class="getStationStatusClass(currentStation.status)">{{
                    currentStation.statusText
                  }}</span>
                </div>
                <div>异常: {{ currentStation.abnormality }}</div>
                <div>{{ currentStation.temperature }}</div>
                <div>日处理量: {{ currentStation.dailyProcessing }}</div>

                <div class="progress-container" style="margin-top: 12px">
                  <el-progress
                    :percentage="currentStation.completionRate"
                    stroke-width="6"
                    stroke-linecap="round"
                    class="progress-bar"
                  />
                </div>
                <div style="text-align: center; font-size: 12px">
                  完成率: {{ currentStation.completionRate }}%
                </div>

                <!-- 站点视频监控 -->
                <div class="video-monitor">
                  <div class="video-status">实时画面 (1080P)</div>
                  <div class="video-placeholder">
                    📹 {{ currentStation.name }}监控画面
                  </div>
                  <div class="video-controls">
                    <el-button size="mini" class="video-btn">全屏</el-button>
                    <el-button size="mini" class="video-btn">截图</el-button>
                    <el-button size="mini" class="video-btn">录制</el-button>
                  </div>
                </div>
              </div>
              <template #footer>
                <div class="popup-actions">
                  <el-button class="popup-btn btn-primary"
                    >进入详情页</el-button
                  >
                  <el-button class="popup-btn btn-secondary"
                    >查看监控</el-button
                  >
                </div>
              </template>
            </el-dialog>
          </div>

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <el-button class="action-btn">批量查看报警站点</el-button>
            <el-button class="action-btn">导出今日核心数据</el-button>
            <el-button class="action-btn">切换地图视角</el-button>
          </div>

          <!-- 地图控制按钮 -->
          <div class="map-controls">
            <el-button circle icon="Plus" class="map-btn" @click="zoomIn" />
            <el-button circle icon="Minus" class="map-btn" @click="zoomOut" />
            <el-button circle icon="FullScreen" class="map-btn" />
          </div>
        </div>

        <!-- 设备运行状态 -->
        <el-card class="data-panel panel-green equipment-panel">
          <div class="panel-title">设备运行状态</div>
          <div class="panel-value">{{ equipmentNormalRate }}% 正常率</div>
          <div class="panel-desc">{{ equipmentToRepair }}台设备待检修</div>

          <div
            class="device-status"
            v-for="(device, index) in devices"
            :key="index"
          >
            <div class="status-indicator" :class="device.statusClass"></div>
            <span style="color: #e0e0e0"
              >{{ device.name }}: {{ device.statusText }}</span
            >
          </div>

          <!-- 设备健康度仪表盘 -->
          <div class="gauge-container">
            <div class="gauge-background">
              <el-progress
                :percentage="equipmentNormalRate"
                stroke-width="20"
                stroke-linecap="round"
                class="gauge-fill"
              />
            </div>
            <div class="gauge-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 右侧面板 -->
      <aside class="right-panel">
        <!-- 安全报警统计 -->
        <el-card class="data-panel panel-red">
          <div class="panel-title">安全报警统计</div>
          <div class="panel-value">{{ emergencyCount }} 紧急</div>
          <div class="panel-desc">24小时趋势: ↘ 下降中</div>
          <div class="trend-chart">
            <div class="trend-line"></div>
          </div>
          <div class="list-item" v-for="(alarm, index) in alarms" :key="index">
            <span style="color: #e0e0e0">{{ alarm.station }}</span>
            <span :class="alarm.levelClass">{{ alarm.level }}</span>
          </div>
        </el-card>

        <!-- 站点视频监控 -->
        <el-card class="data-panel panel-purple">
          <div class="panel-title">站点视频监控</div>

          <div class="video-monitor">
            <div class="video-status">实时 (1080P)</div>
            <div class="video-placeholder">📹 焚烧炉工作区监控</div>
            <div class="video-controls">
              <el-button size="mini" class="video-btn">全屏</el-button>
              <el-button size="mini" class="video-btn">切换</el-button>
            </div>
          </div>

          <div class="video-monitor" style="margin-top: 15px">
            <div class="video-status">实时 (1080P)</div>
            <div class="video-placeholder">📹 排放口监控</div>
            <div class="video-controls">
              <el-button size="mini" class="video-btn">全屏</el-button>
              <el-button size="mini" class="video-btn">切换</el-button>
            </div>
          </div>
        </el-card>
      </aside>
    </main>
  </div>
</template>

<script setup>
// import { ref, computed, onMounted } from "vue";

// 响应式数据
const searchQuery = ref("");
const showUserMenu = ref(false);
const dailyProcessing = ref(9.9);
const dailyProcessingRate = ref(99);
const totalProcessing = ref(185.6);
const complianceRate = ref(98);
const nonCompliantSites = ref(1);
const emergencyCount = ref(3);
const equipmentNormalRate = ref(95);
const equipmentToRepair = ref(2);
const updateTime = ref("15:30:25");
const stationPopupVisible = ref(true);
const currentStation = ref({});
const mapZoom = ref(100);

// 排放数据
const emissionData = ref([
  { name: "颗粒物 (PM2.5)", value: "9.8mg/m³", compliant: false },
  { name: "二氧化硫 (SO₂)", value: "45mg/m³", compliant: true },
  { name: "氮氧化物 (NOx)", value: "78mg/m³", compliant: true },
  { name: "化学需氧量 (COD)", value: "32mg/L", compliant: true },
]);

// 站点数据
const stations = ref([
  {
    name: "青海循化站",
    class: "station-warning station-large",
    style: "top: 45%; left: 45%;",
    status: "warning",
    statusText: "预警",
    abnormality: "焚烧炉温度略高",
    temperature: "320℃ (正常300-310)",
    dailyProcessing: "9.9吨",
    completionRate: 99,
  },
  {
    name: "甘肃兰州站",
    class: "station-critical station-medium",
    style: "top: 40%; left: 50%;",
    status: "critical",
    statusText: "紧急",
    abnormality: "排放超标",
    temperature: "335℃ (正常300-310)",
    dailyProcessing: "8.5吨",
    completionRate: 85,
  },
  {
    name: "四川成都站",
    class: "station-normal station-small",
    style: "top: 55%; left: 55%;",
    status: "normal",
    statusText: "正常",
    abnormality: "无",
    temperature: "305℃ (正常300-310)",
    dailyProcessing: "7.2吨",
    completionRate: 72,
  },
  {
    name: "北京总部",
    class: "station-normal station-large",
    style: "top: 35%; left: 65%;",
    status: "normal",
    statusText: "正常",
    abnormality: "无",
    temperature: "300℃ (正常300-310)",
    dailyProcessing: "10.0吨",
    completionRate: 100,
  },
  {
    name: "上海浦东站",
    class: "station-warning station-medium",
    style: "top: 50%; left: 75%;",
    status: "warning",
    statusText: "预警",
    abnormality: "过滤系统效率下降",
    temperature: "315℃ (正常300-310)",
    dailyProcessing: "9.2吨",
    completionRate: 92,
  },
  {
    name: "广州南沙站",
    class: "station-normal station-small",
    style: "top: 65%; left: 60%;",
    status: "normal",
    statusText: "正常",
    abnormality: "无",
    temperature: "308℃ (正常300-310)",
    dailyProcessing: "8.7吨",
    completionRate: 87,
  },
]);

// 设备数据
const devices = ref([
  {
    name: "焚烧炉A",
    statusClass: "status-warning",
    statusText: "320℃ (正常300-310)",
  },
  { name: "过滤系统", statusClass: "status-normal", statusText: "正常运行" },
  { name: "冷却塔", statusClass: "status-normal", statusText: "正常运行" },
  { name: "排放监测", statusClass: "status-critical", statusText: "数据异常" },
]);

// 报警数据
const alarms = ref([
  { station: "青海循化站", level: "紧急", levelClass: "negative" },
  { station: "甘肃兰州站", level: "预警", levelClass: "warning-text" },
  { station: "四川成都站", level: "预警", levelClass: "warning-text" },
]);

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日 ${weekday}`;
});

// 天气信息
const weatherInfo = ref("青海 晴 12℃ 无预警");

// 方法
const handleSettingsClick = () => {
  // 处理设置按钮点击事件
  console.log("设置按钮被点击");
};

const showStationPopup = (station) => {
  currentStation.value = station;
  stationPopupVisible.value = true;
};

const getStationStatusClass = (status) => {
  switch (status) {
    case "normal":
      return "positive";
    case "warning":
      return "warning-text";
    case "critical":
      return "negative";
    default:
      return "";
  }
};

const zoomIn = () => {
  if (mapZoom.value < 150) {
    mapZoom.value += 10;
  }
};

const zoomOut = () => {
  if (mapZoom.value > 50) {
    mapZoom.value -= 10;
  }
};

// 模拟数据更新
onMounted(() => {
  // 默认显示第一个站点的详情
  currentStation.value = stations.value[0];

  setInterval(() => {
    // 随机更新紧急报警数量
    emergencyCount.value = Math.floor(Math.random() * 5) + 1;

    // 更新数据时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    updateTime.value = `${hours}:${minutes}:${seconds}`;

    // 随机改变一些站点的状态
    stations.value.forEach((station) => {
      if (Math.random() > 0.8) {
        const statuses = ["normal", "warning", "critical"];
        const statusTexts = ["正常", "预警", "紧急"];
        const newStatusIndex = Math.floor(Math.random() * statuses.length);
        station.status = statuses[newStatusIndex];
        station.statusText = statusTexts[newStatusIndex];
      }
    });
  }, 3000);
});
</script>

<style lang="scss" scoped>
// 全局样式
.app-container {
  background: linear-gradient(135deg, #0c1e3a 0%, #14294a 100%);
  color: #e0e0e0;
  min-height: 100vh;
  overflow: hidden;
  margin: -20px;
}

// 顶部导航栏
.header {
  background: rgba(12, 30, 58, 0.9);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(64, 140, 255, 0.2);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  position: relative;
  z-index: 100;

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #e0e0e0;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    &::before {
      content: "🌍";
      margin-right: 8px;
      font-size: 18px;
    }
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 20px;

    .date-weather {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(64, 140, 255, 0.3);
      border-radius: 20px;
      padding: 8px 16px;
      color: #e0e0e0;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 15px;

    .search-box {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(64, 140, 255, 0.3);
      border-radius: 20px;
      width: 280px;
      color: #e0e0e0;
      font-size: 14px;
      transition: all 0.3s ease;
      &:focus {
        outline: none;
        border-color: rgba(64, 140, 255, 0.6);
        box-shadow: 0 0 10px rgba(64, 140, 255, 0.2);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(64, 140, 255, 0.1);
      }
    }

    .settings-btn {
      background: none;
      border: none;
      color: #e0e0e0;
      font-size: 18px;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(64, 140, 255, 0.1);
        transform: rotate(30deg);
      }
    }
  }
}

// 主容器
.main-container {
  display: flex;
  height: calc(100vh - 60px);
  padding: 16px;
  gap: 16px;
}

// 左右侧面板
.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 10px;
}

// 中间内容区
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// 数据面板通用样式
.data-panel {
  background: rgba(18, 36, 64, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(64, 140, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(64, 140, 255, 0.4);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }
}

.panel-red {
  border-color: rgba(255, 80, 80, 0.3);
}

.panel-green {
  border-color: rgba(80, 255, 160, 0.3);
}

.panel-blue {
  border-color: rgba(80, 160, 255, 0.3);
}

.panel-purple {
  border-color: rgba(160, 100, 255, 0.3);
}

// 动画效果
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(64, 140, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(64, 140, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(64, 140, 255, 0.5);
  }
}

// 站点标记样式
.station-marker {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.station-normal {
  background: rgba(80, 255, 160, 0.8);
  box-shadow: 0 0 10px rgba(80, 255, 160, 0.6);
}

.station-warning {
  background: rgba(255, 200, 80, 0.8);
  box-shadow: 0 0 10px rgba(255, 200, 80, 0.6);
  animation: pulse 2s infinite;
}

.station-critical {
  background: rgba(255, 80, 80, 0.8);
  box-shadow: 0 0 10px rgba(255, 80, 80, 0.6);
  animation: blink 1s infinite;
}

.station-large {
  width: 16px;
  height: 16px;
}
.station-medium {
  width: 12px;
  height: 12px;
}
.station-small {
  width: 8px;
  height: 8px;
}

// 地图容器
.map-container {
  background: radial-gradient(
      circle at 20% 30%,
      rgba(20, 60, 120, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(20, 80, 140, 0.15) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, #0c1e3a 0%, #14294a 100%);
  border: 1px solid rgba(64, 140, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(64, 140, 255, 0.1);
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  .environment-info {
    position: absolute;
    top: 20px;

    left: 50%;
    transform: translateX(-50%);
    background: rgba(18, 36, 64, 0.7);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(64, 140, 255, 0.2);
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 14px;
    z-index: 1;
    color: rgba(255, 255, 255, 0.8);
  }
  .china-map {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(20, 40, 80, 0.8) 0%,
        rgba(12, 30, 58, 0.9) 100%
      ),
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,30 Q30,20 40,30 T60,30 T70,40 T80,30 T90,40 T80,50 T70,60 T60,70 T50,80 T40,70 T30,60 T20,50 Z" fill="rgba(64,140,255,0.1)" stroke="rgba(64,140,255,0.3)" stroke-width="0.5"/></svg>');
    border: 1px solid rgba(64, 140, 255, 0.3);
    border-radius: 6px;
    position: relative;
  }
}

// 站点浮窗样式
.station-popup {
  background: rgba(18, 36, 64, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(64, 140, 255, 0.4);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  animation: glow 3s infinite;

  .el-dialog__header {
    padding: 15px 20px 10px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__footer {
    padding: 10px 20px 15px;
  }
}

// 其他样式（进度条、按钮、列表等）
.progress-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  height: 6px;
  margin: 8px 0;
  // overflow: hidden;
}

.panel-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #e0e0e0;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.panel-red .panel-title::before {
  background: rgba(255, 80, 80, 0.8);
  box-shadow: 0 0 6px rgba(255, 80, 80, 0.6);
}

.panel-green .panel-title::before {
  background: rgba(80, 255, 160, 0.8);
  box-shadow: 0 0 6px rgba(80, 255, 160, 0.6);
}

.panel-blue .panel-title::before {
  background: rgba(80, 160, 255, 0.8);
  box-shadow: 0 0 6px rgba(80, 160, 255, 0.6);
}

.panel-purple .panel-title::before {
  background: rgba(160, 100, 255, 0.8);
  box-shadow: 0 0 6px rgba(160, 100, 255, 0.6);
}

.panel-value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
  color: #ffffff;
}

.panel-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  // margin-bottom: 10px;
}
.comparison-value {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}
.comparison-data {
  display: flex;
  gap: 10px;
  .comparison-item {
    flex: 1;
    text-align: center;
  }
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.positive {
  color: rgba(80, 255, 160, 0.9);
}
.negative {
  color: rgba(255, 80, 80, 0.9);
}
.warning-text {
  color: rgba(255, 200, 80, 0.9);
}

// 设备状态指示器
.device-status {
  display: flex;
  align-items: center;
  margin: 5px 0;

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .status-normal {
    background: rgba(80, 255, 160, 0.8);
    box-shadow: 0 0 5px rgba(80, 255, 160, 0.6);
  }

  .status-warning {
    background: rgba(255, 200, 80, 0.8);
    box-shadow: 0 0 5px rgba(255, 200, 80, 0.6);
    animation: pulse 2s infinite;
  }

  .status-critical {
    background: rgba(255, 80, 80, 0.8);
    box-shadow: 0 0 5px rgba(255, 80, 80, 0.6);
    animation: blink 1s infinite;
  }
}

// 视频监控区域
.video-monitor {
  position: relative;
  margin-top: 10px;

  .video-placeholder {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
  }

  .video-status {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: #e0e0e0;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
  }

  .video-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;

    .video-btn {
      background: rgba(0, 168, 255, 0.3);
      border: 1px solid rgba(0, 168, 255, 0.5);
      // border-radius: 4px;
      padding: 4px 8px;
      color: white;
      cursor: pointer;
      font-size: 10px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 168, 255, 0.5);
      }
    }
  }
}

// 趋势图样式
.trend-chart {
  height: 30px;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  // overflow: hidden;

  .trend-line {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(80, 160, 255, 0.3) 30%,
      rgba(80, 255, 160, 0.4) 70%,
      transparent 100%
    );
    clip-path: polygon(
      0% 100%,
      10% 80%,
      20% 60%,
      30% 70%,
      40% 40%,
      50% 50%,
      60% 30%,
      70% 40%,
      80% 20%,
      90% 30%,
      100% 10%,
      100% 100%
    );
  }
}

// 快捷操作按钮
.quick-actions {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 10;

  .action-btn {
    background: rgba(64, 140, 255, 0.2);
    border: 1px solid rgba(64, 140, 255, 0.5);
    border-radius: 6px;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;

    &:hover {
      background: rgba(64, 140, 255, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(64, 140, 255, 0.3);
    }
  }
}

// 地图控制按钮
.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;
  z-index: 10;

  .map-btn {
    background: rgba(18, 36, 64, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(64, 140, 255, 0.3);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(64, 140, 255, 0.2);
      border-color: rgba(64, 140, 255, 0.6);
      transform: scale(1.1);
    }
  }
}

// 仪表盘样式
.gauge-container {
  position: relative;
  height: 80px;
  margin: 10px 0;

  .gauge-background {
    position: absolute;
    width: 100%;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }

  .gauge-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
}

// 总处理量样式
.total-processing {
  text-align: center;

  .total-value {
    font-size: 24px;
    font-weight: bold;
    margin: 5px 0;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(80, 160, 255, 0.5);
  }

  .total-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
}

// 数据卡片样式
.data-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 8px;
  margin-top: 8px;

  .data-card-title {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }

  .data-card-value {
    font-size: 16px;
    font-weight: bold;
    color: #e0e0e0;
    margin: 4px 0;
  }
}

// 设备运行状态面板
.equipment-panel {
  height: 200px;
}
</style>
