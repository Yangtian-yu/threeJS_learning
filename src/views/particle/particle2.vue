<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let base, controls, gui, SmallBall;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.camera.position.set(0, 0, 8);
  createSphere();
  createAxesHelper();
  update();
  window.addEventListener("resize", resize);
});

const createSphere = () => {
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 5000;
  //设置缓冲区数组
  const position = new Float32Array(5000 * 3);
  //设置粒子顶点颜色
  const colors = new Float32Array(count * 3);
  //设置顶点
  for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random();
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(position, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const TextureLoader = new THREE.TextureLoader();
  const texture = TextureLoader.load("matter/textures/particles/1.png");
  //map贴图将three.js版本换成0.137.5 即可
  const pointMat = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xfff000,
    map: texture,
    sizeAttenuation: true,
    alphaMap: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true, //启用顶点颜色
  });
  const point = new THREE.Points(particlesGeometry, pointMat);
  base.scene.add(point);
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(20);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

const clock = new THREE.Clock();

function update() {
  base.update();
  controls.update();
  requestAnimationFrame(update);
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
