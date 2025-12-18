<template>
  <div style="width: 100%; height: 80vh">
    <!-- 直接传入模型地址使用 -->
    <ModelViewer
      :modelSrc="modelSrc"
      backgroundColor="#333333"
      :autoRotate="true"
      @load-complete="onModelLoaded"
    />
   
  </div>
   <el-button @click="show3D('/f22_raptor.glb')">飞机</el-button>
    <el-button @click="show3D('/free_merc_hovercar/scene.gltf')">汽车</el-button>
    <el-button @click="show3D('/f22_raptor.glb')">航空母舰</el-button>

    <liu-button size="small" type="primary">111</liu-button>
</template>

<script setup>
import ModelViewer from "@/components/ModelViewer/index.vue";
import LiuButton from "@/components/LiuButton/index.vue";
import { ref } from "vue";

const onModelLoaded = () => {
  console.log("模型加载完成");
};

const modelSrc = ref("/f22_raptor.glb");


const show3D = (url) => {
  modelSrc.value = url;
};
</script>