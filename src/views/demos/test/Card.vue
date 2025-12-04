<template>
  <div
    class="card"
    :class="`panel-${props.type}`"
    :style="{ width: props.width, height: props.height }"
  >
    <!-- 标题 -->
    <h3>
      <slot name="title">{{ title }}</slot>
    </h3>
    <!-- 内容 -->
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "blue", // blue, green, orange, red, purple
    validator: (value) =>
      ["blue", "green", "orange", "red", "purple"].includes(value),
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "auto",
  },
});
</script>

<style lang="scss" scoped>
.card {
  background: rgba(18, 36, 64, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(64, 140, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(64, 140, 255, 0.4);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }

  h3 {
    font-size: 16px;
    margin: 0;
    margin-bottom: 8px;
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

  .content {
    font-size: 14px;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 8px;
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

.panel-orange {
  border-color: rgba(255, 180, 80, 0.3);
}

.panel-cyan {
  border-color: rgba(80, 220, 255, 0.3);
}
.panel-red h3::before {
  background: rgba(255, 80, 80, 0.8);
  box-shadow: 0 0 6px rgba(255, 80, 80, 0.6);
}

.panel-green h3::before {
  background: rgba(80, 255, 160, 0.8);
  box-shadow: 0 0 6px rgba(80, 255, 160, 0.6);
}

.panel-blue h3::before {
  background: rgba(80, 160, 255, 0.8);
  box-shadow: 0 0 6px rgba(80, 160, 255, 0.6);
}

.panel-purple h3::before {
  background: rgba(160, 100, 255, 0.8);
  box-shadow: 0 0 6px rgba(160, 100, 255, 0.6);
}

.panel-orange h3::before {
  background: rgba(255, 180, 80, 0.8);
  box-shadow: 0 0 6px rgba(255, 180, 80, 0.6);
}

.panel-cyan h3::before {
  background: rgba(80, 220, 255, 0.8);
  box-shadow: 0 0 6px rgba(80, 220, 255, 0.6);
}
</style>
