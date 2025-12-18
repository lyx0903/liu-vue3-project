<template>
  <div class="header">
    <div class="logo">
      <img src="/public/vite.svg" alt="" />
      <h2>mc</h2>
    </div>
    <div class="date-weather">
      <span>{{ currentTime }}</span>
      <span>{{ currentWeek }}</span>
      <span>| 青海 晴 12℃ 无预警</span>
    </div>
    <div class="right">
      <input
        type="text"
        class="search-box"
        placeholder="🔍 输入站点名称/省份..."
      />
      <div class="user-info">
        <el-icon style="font-size: 16px"><User /></el-icon>
        <span>张三-总部监管部</span>
      </div>
      <el-icon class="settings-btn"><Setting /></el-icon>
    </div>
  </div>
</template>

<script setup>
// 获取当前时间
const currentTime =
  new Date().getFullYear() +
  "年" +
  String(new Date().getMonth() + 1).padStart(2, "0") +
  "月" +
  String(new Date().getDate()).padStart(2, "0") +
  "日";

// 获取当前星期（通过 weekMap 数组映射）
const weekMap = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const currentWeekNum = new Date().getDay(); // 获取当前星期数字（0-6）
const currentWeek = weekMap[currentWeekNum]; // 转换为中文
</script>

<style lang="scss" scoped>
.header {
  color: #e0e0e0;
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
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 5px;

    h2 {
      margin: 0;
    }
  }

  // .logo::before {
  //   content: "🌍";
  //   margin-right: 8px;
  //   font-size: 18px;
  // }

  .date-weather {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .date-weather,
  .search-box {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(64, 140, 255, 0.3);
    border-radius: 20px;
    padding: 5px 10px;
    font-size: 14px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 20px;

    .search-box {
      color: #e0e0e0;
      transition: all 0.3s ease;
    }

    .search-box:focus {
      outline: none;
      border-color: rgba(64, 140, 255, 0.6);
      box-shadow: 0 0 10px rgba(64, 140, 255, 0.2);
    }
    .search-box::placeholder {
      color: #e0e0e0;
      opacity: 0.5; /* 部分浏览器默认 opacity 较低，显式设为 1 更清晰 */
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .user-info:hover {
      background: rgba(64, 140, 255, 0.1);
    }

    .settings-btn {
      font-size: 18px;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .settings-btn:hover {
      background: rgba(64, 140, 255, 0.1);
      transform: rotate(30deg);
    }
  }
}
</style>
