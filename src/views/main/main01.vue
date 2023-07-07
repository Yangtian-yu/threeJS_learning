<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const canvasDom = ref(null);
let controls, renderer;
const scene = new THREE.Scene();
//创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);

//设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

onMounted(() => {
  initRender();
  createBox();
  controls = new OrbitControls(camera, renderer.domElement);
  render();
});

const render = () => {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
};

const initRender = () => {
  //初始化渲染器
  renderer = new THREE.WebGL1Renderer({
    canvas: canvasDom.value,
    antialias: true,
  });
  //设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // window.addEventListener("resize", resize);
};
const createBox = () => {
  //添加物体
  //创建几何体
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(cube, mat);
  scene.add(mesh);
  console.log(scene);
};
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
