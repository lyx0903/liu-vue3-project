<template>
  <div class="model-viewer">
    <!-- 模型容器 -->
    <div ref="container" class="model-container"></div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">加载模型中... {{ loadProgress }}%</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-overlay">
      <p class="error-text">{{ errorMessage }}</p>
      <button @click="reloadModel" class="retry-button">重试</button>
    </div>
    
    <!-- 控制按钮 -->
    <div class="controls" v-if="showControls">
      <button @click="toggleRotation" class="control-btn" :title="isRotating ? '暂停旋转' : '开始旋转'">
        <i class="fas" :class="isRotating ? 'fa-pause' : 'fa-play'"></i>
      </button>
      <button @click="resetView" class="control-btn" title="重置视图">
        <i class="fas fa-sync-alt"></i>
      </button>
      <button @click="zoomIn" class="control-btn" title="放大">
        <i class="fas fa-search-plus"></i>
      </button>
      <button @click="zoomOut" class="control-btn" title="缩小">
        <i class="fas fa-search-minus"></i>
      </button>
    </div>
    
    <!-- 模型选择（仅在未通过props指定模型时显示） -->
    <div class="model-selector" v-if="!modelSrc && showModelSelector">
      <select v-model="selectedModel" @change="loadSelectedModel" class="model-select">
        <option value="">选择模型</option>
        <option v-for="model in availableModels" :key="model.id" :value="model.url">
          {{ model.name }}
        </option>
      </select>
      
      <label class="file-label">
        <i class="fas fa-upload"></i>
        <input type="file" accept=".glb,.gltf,.obj,.fbx" @change="handleFileUpload" class="file-input">
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps, defineEmits, shallowRef } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// 定义组件属性
const props = defineProps({
  // 模型资源地址
  modelSrc: {
    type: String,
    default: ''
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    default: '#f0f0f0'
  },
  // 是否自动旋转
  autoRotate: {
    type: Boolean,
    default: true
  },
  // 是否显示控制按钮
  showControls: {
    type: Boolean,
    default: true
  },
  // 是否显示模型选择器
  showModelSelector: {
    type: Boolean,
    default: true
  },
  // 初始缩放比例
  initialScale: {
    type: Number,
    default: 1.5
  }
});

// 定义组件事件
const emits = defineEmits(['load-start', 'load-progress', 'load-complete', 'load-error']);

// 组件状态 - 只对需要在模板中使用的状态使用响应式
const container = ref(null);
const isLoading = ref(false);
const loadProgress = ref(0);
const errorMessage = ref('');
const isRotating = ref(props.autoRotate);
const selectedModel = ref('');

// Three.js核心对象 - 使用普通变量而非响应式变量
let scene, camera, renderer, controls;
let model = null; // 关键修复：不使用ref存储Three.js对象

// 可用模型列表（默认示例）
const availableModels = [
  { id: 1, name: "示例机器人", url: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb" },
  { id: 2, name: "示例头盔", url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf" },
  { id: 3, name: "示例 Suzanne", url: "https://threejs.org/examples/models/gltf/Suzanne/glTF/Suzanne.gltf" }
];

// 初始化Three.js场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(props.backgroundColor);
  
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // 添加方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // 窗口大小变化时调整
  window.addEventListener('resize', onWindowResize);
  
  // 开始动画循环
  animate();
  
  // 如果有传入模型地址，加载模型
  if (props.modelSrc) {
    loadModel(props.modelSrc);
  }
};

// 窗口大小变化处理
const onWindowResize = () => {
  if (!container.value) return;
  
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

// 动画循环
const animate = () => {
  requestAnimationFrame(animate);
  
  // 如果启用自动旋转且有模型
  if (isRotating.value && model) {
    model.rotation.y += 0.005;
  }
  
  controls.update();
  renderer.render(scene, camera);
};

// 加载模型
const loadModel = (url) => {
  // 清除现有模型
  if (model) {
    scene.remove(model);
    model = null;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  loadProgress.value = 0;
  
  // 触发加载开始事件
  emits('load-start');
  
  // 根据文件扩展名选择合适的加载器
  if (url.endsWith('.glb') || url.endsWith('.gltf')) {
    loadGLTFModel(url);
  } else if (url.endsWith('.obj')) {
    loadOBJModel(url);
  } else if (url.endsWith('.fbx')) {
    loadFBXModel(url);
  } else {
    const error = '不支持的模型格式';
    errorMessage.value = error;
    emits('load-error', error);
    isLoading.value = false;
  }
};

// 加载GLTF/GLB模型
const loadGLTFModel = (url) => {
  const loader = new GLTFLoader();
  
  // 添加DRACO压缩支持
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);
  
  loader.load(
    url,
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      
      // 自动居中模型
      centerModel(model);
      
      isLoading.value = false;
      emits('load-complete');
    },
    (xhr) => {
      // 进度更新
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadProgress.value = progress;
      emits('load-progress', progress);
    },
    (error) => {
      console.error('GLTF加载错误:', error);
      const errorMsg = '模型加载失败: ' + error.message;
      errorMessage.value = errorMsg;
      emits('load-error', errorMsg);
      isLoading.value = false;
    }
  );
};

// 加载OBJ模型
const loadOBJModel = (url) => {
  const loader = new OBJLoader();
  
  loader.load(
    url,
    (object) => {
      model = object;
      scene.add(model);
      
      // 为OBJ模型添加材质
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        }
      });
      
      // 自动居中模型
      centerModel(model);
      
      isLoading.value = false;
      emits('load-complete');
    },
    (xhr) => {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadProgress.value = progress;
      emits('load-progress', progress);
    },
    (error) => {
      console.error('OBJ加载错误:', error);
      const errorMsg = '模型加载失败: ' + error.message;
      errorMessage.value = errorMsg;
      emits('load-error', errorMsg);
      isLoading.value = false;
    }
  );
};

// 加载FBX模型
const loadFBXModel = (url) => {
  const loader = new FBXLoader();
  
  loader.load(
    url,
    (object) => {
      model = object;
      scene.add(model);
      
      // 自动居中模型
      centerModel(model);
      
      isLoading.value = false;
      emits('load-complete');
    },
    (xhr) => {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadProgress.value = progress;
      emits('load-progress', progress);
    },
    (error) => {
      console.error('FBX加载错误:', error);
      const errorMsg = '模型加载失败: ' + error.message;
      errorMessage.value = errorMsg;
      emits('load-error', errorMsg);
      isLoading.value = false;
    }
  );
};

// 居中模型
const centerModel = (model) => {
  // 计算模型边界框
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  // 调整模型位置使其居中
  model.position.sub(center);
  
  // 调整相机位置以完整显示模型
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraZ *= props.initialScale; // 应用初始缩放比例
  camera.position.z = cameraZ;
  
  // 调整控制器的焦点
  controls.target.set(0, 0, 0);
};

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const url = URL.createObjectURL(file);
  selectedModel.value = url;
  loadModel(url);
  
  // 清除输入，允许重复上传同一文件
  event.target.value = '';
};

// 加载选中的模型
const loadSelectedModel = () => {
  if (selectedModel.value) {
    loadModel(selectedModel.value);
  }
};

// 重新加载模型
const reloadModel = () => {
  if (props.modelSrc) {
    loadModel(props.modelSrc);
  } else if (selectedModel.value) {
    loadModel(selectedModel.value);
  }
};

// 切换自动旋转
const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

// 重置视图
const resetView = () => {
  if (model) {
    centerModel(model);
  }
};

// 放大
const zoomIn = () => {
  camera.position.z = Math.max(0.1, camera.position.z * 0.8);
};

// 缩小
const zoomOut = () => {
  camera.position.z *= 1.2;
};

// 组件挂载时初始化
onMounted(() => {
  if (container.value) {
    initScene();
  }
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  
  if (renderer) {
    renderer.dispose();
    if (container.value && renderer.domElement.parentNode) {
      container.value.removeChild(renderer.domElement);
    }
  }
  
  if (scene) {
    scene.clear();
  }
  
  // 清除模型引用
  model = null;
});

// 监听props变化
watch(() => props.modelSrc, (newVal) => {
  if (newVal && container.value) {
    loadModel(newVal);
  }
});

watch(() => props.autoRotate, (newVal) => {
  isRotating.value = newVal;
});

watch(() => props.backgroundColor, (newVal) => {
  if (scene) {
    scene.background = new THREE.Color(newVal);
  }
});
</script>

<style scoped>
/* 样式保持不变 */
.model-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.model-container {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  color: #333;
}

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

.error-text {
  color: #e74c3c;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0 1rem;
}

.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 5;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.control-btn:hover {
  background-color: white;
  transform: scale(1.1);
}

.model-selector {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 5;
}

.model-select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.file-label {
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 5px;
}

.file-input {
  display: none;
}

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

/* 响应式调整 */
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
  
  .model-selector {
    top: 10px;
    left: 10px;
    flex-direction: column;
  }
}
</style>
