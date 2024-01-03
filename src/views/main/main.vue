<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

const canvasDom = ref(null);
const scene = new THREE.Scene();
//创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerWidth
);
//设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

onMounted(() => {
  createBox();
  initRender();
});
const initRender = () => {
  // //初始化渲染器
  const renderer = new THREE.WebGL1Renderer({
    canvas: canvasDom.value,
    antialias: true,
  });
  // //设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // //将webgl渲染的canvas内容添加到body上
  // renderer.render(scene, camera);

  renderer.render(scene, camera);
};
const createBox = () => {
  //添加物体
  //创建几何体
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const mesh = new THREE.Mesh(cube, mat);
  scene.add(mesh);
};
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
