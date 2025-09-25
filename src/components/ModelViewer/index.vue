<template>
  <!-- 模型查看器主容器 -->
  <div class="model-viewer">
    <!-- Three.js渲染器挂载点 -->
    <div ref="container" class="model-container"></div>

    <!-- 加载状态遮罩层 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">加载模型中... {{ loadProgress }}%</p>
    </div>

    <!-- 错误提示遮罩层 -->
    <div v-if="errorMessage" class="error-overlay">
      <p class="error-text">{{ errorMessage }}</p>
      <button @click="reloadModel" class="retry-button">重试</button>
    </div>

    <!-- 控制按钮组 -->
    <div class="controls" v-if="showControls">
      <!-- 旋转控制按钮 -->
      <div
        class="controls-li"
        @click="toggleRotation"
        :title="isRotating ? '暂停旋转' : '开始旋转'"
      >
        <el-icon v-show="isRotating"><VideoPlay /></el-icon>
        <el-icon v-show="!isRotating"><VideoPause /></el-icon>
      </div>
      <!-- 重置视图按钮 -->
      <div class="controls-li" @click="resetView" title="重置视图">
        <el-icon><Aim /></el-icon>
      </div>
      <!-- 放大按钮 -->
      <div class="controls-li" @click="zoomIn" title="放大">
        <el-icon><CirclePlus /></el-icon>
      </div>
      <!-- 缩小按钮 -->
      <div class="controls-li" @click="zoomOut" title="缩小">
        <el-icon><Remove /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue相关导入
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineProps,
  defineEmits,
} from "vue";

// Three.js核心库
import * as THREE from "three";
// Three.js插件和加载器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// Element Plus图标
import {
  VideoPlay,
  VideoPause,
  Aim,
  CirclePlus,
  Remove,
} from "@element-plus/icons-vue";

// 定义组件属性（Props）
const props = defineProps({
  // 模型文件路径
  modelSrc: {
    type: String,
    default: "",
  },
  // 场景背景颜色
  // backgroundColor: {
  //   type: String,
  //   default: "#f0f0f0",
  // },
  // 是否自动旋转
  autoRotate: {
    type: Boolean,
    default: true,
  },
  // 是否显示控制按钮
  showControls: {
    type: Boolean,
    default: true,
  },
  // 是否显示模型选择器（未在模板中使用）
  showModelSelector: {
    type: Boolean,
    default: true,
  },
  // 模型初始缩放比例
  initialScale: {
    type: Number,
    default: 1,
  },
  // 相机视野角度（FOV）
  cameraFov: {
    type: Number,
    default: 45,
  },
  // 相机俯视角度
  cameraAngle: {
    type: Number,
    default: 60, // 度
  },
});

// 定义组件事件（Emits）
const emits = defineEmits([
  "load-start",     // 模型加载开始
  "load-progress",  // 模型加载进度更新
  "load-complete",  // 模型加载完成
  "load-error",     // 模型加载错误
]);

// 组件响应式状态
const container = ref(null);          // 容器DOM引用
const isLoading = ref(false);         // 加载状态
const loadProgress = ref(0);          // 加载进度百分比
const errorMessage = ref("");         // 错误信息
const isRotating = ref(props.autoRotate); // 旋转状态

// Three.js核心变量
let scene, camera, renderer, controls; // 场景、相机、渲染器、控制器
let model = null; // 当前加载的模型对象

// 初始化Three.js场景
const initScene = () => {
  // 创建场景并设置背景色
  scene = new THREE.Scene();
  scene.background = new THREE.Color(props.backgroundColor);

  // 设置环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // 设置方向光（从斜上方照射，适合俯视视角）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(10, 15, 7.5);
  scene.add(directionalLight);

  // 创建透视相机
  camera = new THREE.PerspectiveCamera(
    props.cameraFov, // 视野角度
    container.value.clientWidth / container.value.clientHeight, // 宽高比
    0.1, // 近裁剪面
    1000  // 远裁剪面
  );

  // 创建WebGL渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // 创建轨道控制器（支持鼠标拖拽、缩放等交互）
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;    // 启用阻尼效果
  controls.dampingFactor = 0.05;    // 阻尼系数

  // 监听窗口大小变化
  window.addEventListener("resize", onWindowResize);
  
  // 启动动画循环
  animate();

  // 如果已有模型路径，立即加载模型
  if (props.modelSrc) {
    loadModel(props.modelSrc);
  }
};

// 处理窗口大小变化
const onWindowResize = () => {
  if (!container.value) return;

  // 更新相机宽高比和投影矩阵
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  
  // 更新渲染器大小
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

// 动画循环函数
const animate = () => {
  // 请求下一帧动画
  requestAnimationFrame(animate);

  // 如果启用旋转且有模型，让模型绕Y轴旋转
  if (isRotating.value && model) {
    model.rotation.y += 0.005;
  }

  // 更新控制器（阻尼效果需要）
  controls.update();
  
  // 渲染场景
  renderer.render(scene, camera);
};

// 加载模型主函数
const loadModel = (url) => {
  // 清理现有模型
  if (model) {
    scene.remove(model);
    model = null;
  }

  // 重置加载状态
  isLoading.value = true;
  errorMessage.value = "";
  loadProgress.value = 0;
  emits("load-start");

  // 根据文件扩展名选择对应的加载器
  if (url.endsWith(".glb") || url.endsWith(".gltf")) {
    loadGLTFModel(url);
  } else if (url.endsWith(".obj")) {
    loadOBJModel(url);
  } else if (url.endsWith(".fbx")) {
    loadFBXModel(url);
  } else {
    // 不支持的格式处理
    const error = "不支持的模型格式";
    errorMessage.value = error;
    emits("load-error", error);
    isLoading.value = false;
  }
};

// 加载GLTF/GLB格式模型
const loadGLTFModel = (url) => {
  const loader = new GLTFLoader();
  
  // 设置DRACO解码器（用于压缩的GLTF文件）
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    url,
    // 加载成功回调
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      centerModel(model); // 居中并设置视角
      isLoading.value = false;
      emits("load-complete");
    },
    // 加载进度回调
    (xhr) => {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadProgress.value = progress;
      emits("load-progress", progress);
    },
    // 加载错误回调
    (error) => {
      console.error("GLTF加载错误:", error);
      const errorMsg = "模型加载失败: " + error.message;
      errorMessage.value = errorMsg;
      emits("load-error", errorMsg);
      isLoading.value = false;
    }
  );
};

// 加载OBJ格式模型
const loadOBJModel = (url) => {
  const loader = new OBJLoader();

  loader.load(
    url,
    (object) => {
      model = object;
      scene.add(model);

      // OBJ文件不包含材质信息，需要手动设置材质
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        }
      });

      centerModel(model);
      isLoading.value = false;
      emits("load-complete");
    },
    (xhr) => {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadProgress.value = progress;
      emits("load-progress", progress);
    },
    (error) => {
      console.error("OBJ加载错误:", error);
      const errorMsg = "模型加载失败: " + error.message;
      errorMessage.value = errorMsg;
      emits("load-error", errorMsg);
      isLoading.value = false;
    }
  );
};

// 加载FBX格式模型
const loadFBXModel = (url) => {
  const loader = new FBXLoader();

  loader.load(
    url,
    (object) => {
      model = object;
      scene.add(model);
      centerModel(model);
      isLoading.value = false;
      emits("load-complete");
    },
    (xhr) => {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadProgress.value = progress;
      emits("load-progress", progress);
    },
    (error) => {
      console.error("FBX加载错误:", error);
      const errorMsg = "模型加载失败: " + error.message;
      errorMessage.value = errorMsg;
      emits("load-error", errorMsg);
      isLoading.value = false;
    }
  );
};

// 居中模型并设置相机视角
const centerModel = (model) => {
  // 计算模型的包围盒
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // 将模型移动到场景中心
  model.position.sub(center);

  // 计算合适的相机距离
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180); // 转换为弧度
  let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraDistance *= props.initialScale; // 应用初始缩放比例

  // 计算俯视视角的相机位置
  const angleRad = (props.cameraAngle * Math.PI) / 180; // 角度转弧度
  
  // 根据俯视角度计算相机坐标
  const cameraX = Math.sin(angleRad) * cameraDistance;
  const cameraY = Math.cos(angleRad) * cameraDistance * 0.7; // 降低高度增强俯视效果
  const cameraZ = Math.cos(angleRad) * cameraDistance;

  // 设置相机位置
  camera.position.set(cameraX, cameraY, cameraZ);

  // 设置控制器目标点（相机看向的位置）
  controls.target.set(0, size.y * 0.2, 0); // 稍微向上偏移，更好地展示模型
  controls.update();
};

// 控制函数
const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

const resetView = () => {
  if (model) {
    centerModel(model);
  }
};

const zoomIn = () => {
  camera.position.multiplyScalar(0.8); // 缩小距离实现放大效果
};

const zoomOut = () => {
  camera.position.multiplyScalar(1.2); // 增加距离实现缩小效果
};

const reloadModel = () => {
  if (props.modelSrc) {
    loadModel(props.modelSrc);
  }
};

// 生命周期钩子
onMounted(() => {
  // 组件挂载后初始化场景
  if (container.value) {
    initScene();
  }
});

onUnmounted(() => {
  // 组件卸载时清理资源
  window.removeEventListener("resize", onWindowResize);

  if (renderer) {
    renderer.dispose(); // 释放渲染器资源
    if (container.value && renderer.domElement.parentNode) {
      container.value.removeChild(renderer.domElement);
    }
  }

  if (scene) {
    scene.clear(); // 清空场景
  }

  model = null; // 清除模型引用
});

// 监听属性变化
watch(
  () => props.modelSrc,
  (newVal) => {
    // 模型路径变化时重新加载模型
    if (newVal && container.value) {
      loadModel(newVal);
    }
  }
);

watch(
  () => props.autoRotate,
  (newVal) => {
    // 自动旋转设置变化时更新状态
    isRotating.value = newVal;
  }
);

watch(
  () => props.backgroundColor,
  (newVal) => {
    // 背景色变化时更新场景背景
    if (scene) {
      scene.background = new THREE.Color(newVal);
    }
  }
);

watch(
  () => props.cameraFov,
  (newVal) => {
    // 相机视野变化时更新投影矩阵
    if (camera) {
      camera.fov = newVal;
      camera.updateProjectionMatrix();
    }
  }
);

watch(
  () => props.cameraAngle,
  (newVal) => {
    // 相机角度变化时重新居中模型
    if (model) {
      centerModel(model);
    }
  }
);
</script>

<style scoped>
/* 模型查看器容器样式 */
.model-viewer {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 模型容器样式 */
.model-container {
  width: 100%;
  height: 100%;
}

/* 加载遮罩层样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

/* 加载动画 spinner */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* spinner旋转动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 加载文字样式 */
.loading-text {
  font-size: 1.2rem;
  color: #333;
}

/* 错误遮罩层样式 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

/* 错误文字样式 */
.error-text {
  color: #e74c3c;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0 1rem;
}

/* 重试按钮样式 */
.retry-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #2980b9;
}

/* 控制按钮组样式 */
.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 5;
}

/* 控制按钮图标颜色 */
.controls .controls-li .el-icon {
  color: #fff;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .model-viewer {
    min-height: 300px;
  }

  .controls {
    bottom: 10px;
    right: 10px;
  }

  .control-btn {
    width: 36px;
    height: 36px;
  }
}
</style>