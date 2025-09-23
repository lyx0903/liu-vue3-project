<template>
  <div class="model-viewer">
    <div ref="container" class="model-container"></div>
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">加载模型中... {{ loadProgress }}%</p>
    </div>
    
    <div v-if="errorMessage" class="error-overlay">
      <p class="error-text">{{ errorMessage }}</p>
      <button @click="reloadModel" class="retry-button">重试</button>
    </div>
    
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
import { ref, onMounted, onUnmounted, watch, defineProps, defineEmits } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// 定义组件属性
const props = defineProps({
  modelSrc: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: '#f0f0f0'
  },
  autoRotate: {
    type: Boolean,
    default: true
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showModelSelector: {
    type: Boolean,
    default: true
  },
  initialScale: {
    type: Number,
    default: 1
  },
  // 相机视野角度，45度更适合俯视视角
  cameraFov: {
    type: Number,
    default: 45
  },
  // 俯视角度，45度
  cameraAngle: {
    type: Number,
    default:60 // 度
  }
});

const emits = defineEmits(['load-start', 'load-progress', 'load-complete', 'load-error']);

// 组件状态
const container = ref(null);
const isLoading = ref(false);
const loadProgress = ref(0);
const errorMessage = ref('');
const isRotating = ref(props.autoRotate);
const selectedModel = ref('');

// Three.js核心对象
let scene, camera, renderer, controls;
let model = null;

// 可用模型列表
const availableModels = [
  { id: 1, name: "示例机器人", url: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb" },
  { id: 2, name: "示例头盔", url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf" },
  { id: 3, name: "示例 Suzanne", url: "https://threejs.org/examples/models/gltf/Suzanne/glTF/Suzanne.gltf" }
];

// 初始化Three.js场景
const initScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(props.backgroundColor);
  
  // 调整灯光以适应俯视视角
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  // 从斜上方打光，更适合俯视视角
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(10, 15, 7.5);
  scene.add(directionalLight);
  
  // 创建相机，使用45度视野
  camera = new THREE.PerspectiveCamera(
    props.cameraFov, 
    container.value.clientWidth / container.value.clientHeight, 
    0.1, 
    1000
  );
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  window.addEventListener('resize', onWindowResize);
  animate();
  
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
  
  if (isRotating.value && model) {
    model.rotation.y += 0.005;
  }
  
  controls.update();
  renderer.render(scene, camera);
};

// 加载模型
const loadModel = (url) => {
  if (model) {
    scene.remove(model);
    model = null;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  loadProgress.value = 0;
  emits('load-start');
  
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
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);
  
  loader.load(
    url,
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      centerModel(model); // 设置45度俯视视角
      isLoading.value = false;
      emits('load-complete');
    },
    (xhr) => {
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
      
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        }
      });
      
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

// 居中模型并设置45度俯视视角
const centerModel = (model) => {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  // 调整模型位置使其居中
  model.position.sub(center);
  
  // 计算相机距离
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraDistance *= props.initialScale;
  
  // 关键修改：设置45度俯视视角
  // 将角度转换为弧度
  const angleRad = (props.cameraAngle * Math.PI) / 180;
  
  // 计算相机位置，形成俯视角度
  const cameraX = Math.sin(angleRad) * cameraDistance;
  const cameraY = Math.cos(angleRad) * cameraDistance * 0.7; // 稍微降低高度，增强俯视效果
  const cameraZ = Math.cos(angleRad) * cameraDistance;
  
  // 设置相机位置
  camera.position.set(cameraX, cameraY, cameraZ);
  
  // 让相机看向模型中心
  controls.target.set(0, size.y * 0.2, 0);
  controls.update();
};

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const url = URL.createObjectURL(file);
  selectedModel.value = url;
  loadModel(url);
  event.target.value = '';
};

const loadSelectedModel = () => {
  if (selectedModel.value) {
    loadModel(selectedModel.value);
  }
};

const reloadModel = () => {
  if (props.modelSrc) {
    loadModel(props.modelSrc);
  } else if (selectedModel.value) {
    loadModel(selectedModel.value);
  }
};

const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

const resetView = () => {
  if (model) {
    centerModel(model);
  }
};

const zoomIn = () => {
  camera.position.multiplyScalar(0.8);
};

const zoomOut = () => {
  camera.position.multiplyScalar(1.2);
};

onMounted(() => {
  if (container.value) {
    initScene();
  }
});

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
  
  model = null;
});

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

watch(() => props.cameraFov, (newVal) => {
  if (camera) {
    camera.fov = newVal;
    camera.updateProjectionMatrix();
  }
});

watch(() => props.cameraAngle, (newVal) => {
  if (model) {
    centerModel(model);
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
