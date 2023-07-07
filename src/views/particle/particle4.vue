<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let base, controls, gui, SmallBall, point;
const canvasDom = ref(null);
const clock = new THREE.Clock();
let geometry = null;
let material = null;
let points = null;

onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.camera.position.set(0, 0, 60);
  createSphere();
  createAxesHelper();
  update();
  window.addEventListener("resize", resize);
});

const createSphere = () => {
  const params = {
    count: 10000,
    size: 0.1,
    radius: 5,
    branch: 6,
    color: "#ff6030",
    rotateScale: 0.3,
    endColor: "#1b3984",
  };
  generateGalaxy(params);
};

const generateGalaxy = (params) => {
  const TextureLoader = new THREE.TextureLoader();
  const texture = TextureLoader.load("matter/textures/particles/1.png");
  //生成顶点
  geometry = new THREE.BufferGeometry();
  //随机生成位置和
  const position = new Float32Array(params.count * 3);
  //设置顶点颜色
  const colors = new Float32Array(params.count * 3);
  const centerColor = new THREE.Color(params.color);
  const endColor = new THREE.Color(params.endColor);
  //循环生成点
  for (let i = 0; i < params.count; i++) {
    //当前的点应该在哪一条分支的角度上
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
    //当前点距离园心
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
    const current = i * 3;
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    position[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    position[current + 1] = 0 + randomY;
    position[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;
    //混合颜色
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  //设置点材质
  material = new THREE.PointsMaterial({
    // color: params.color,
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: texture,
    alphaMap: texture,
    transparent: true,
    vertexColors: true, //启用顶点颜色
  });
  point = new THREE.Points(geometry, material);
  base.scene.add(point);
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(20);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

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
