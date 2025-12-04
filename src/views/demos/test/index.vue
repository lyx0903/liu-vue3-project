<template>
  <div class="app">
    <Header />
    <div class="content">
      <div class="left">
        
        <Card type="green">
          <template #title>当日处理量</template>

          <div class="panel-value">9.9/10.0 吨</div>
          <div class="progress-container">
            <div class="progress-bar" style="width: 99%"></div>
          </div>
          <div class="panel-desc">完成率: 99%</div>

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
        </Card>

        <Card>
          <template #title>总处理量</template>
          
        </Card>
        <Card>
          <template #title>排放数据对比</template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import Card from "./Card.vue";
</script>
<style lang="scss" scoped>
.app {
  background: linear-gradient(135deg, #0c1e3a 0%, #14294a 100%);
  height: calc(100vh - 60px);
  overflow: hidden;
}
.content {
  padding: 20px;
  display: flex;
  gap: 16px;

  .left {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 300px;

    // 卡片1
    .panel-value {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }

    .panel-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    /* 进度条样式 */
    .progress-container {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      height: 6px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(80, 255, 160, 0.8),
        rgba(80, 160, 255, 0.8)
      );
      border-radius: 4px;
      position: relative;
    }
    // 环比/同比数据
    .comparison-data {
      display: flex;
      gap: 10px;
      .comparison-item {
        flex: 1;
        text-align: center;
        .comparison-value {
          font-size: 16px;
          font-weight: bold;
          color: rgba(80, 255, 160, 0.9);
        }
      }
    }
  }
}
</style>
