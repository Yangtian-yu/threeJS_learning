<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let base, controls, gui;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  base.addAmbientLight(0.5);
  let dirLight = base.addSpotLight(0.5);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true; //可以投射阴影
  //设置阴影贴图模糊度
  dirLight.shadow.radius = 20;
  dirLight.intensity = 2;
  //设置阴影贴图的分辨率
  dirLight.shadow.mapSize.set(4096, 4096);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 5);
  createAxesHelper();
  let sphere = createSphere(dirLight);
  createPlane();
  createGUI(dirLight, sphere);
  update();
  window.addEventListener("resize", resize);
});

const createSphere = (dirLight) => {
  const geo = new THREE.SphereBufferGeometry(1, 20, 20);
  const mat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  dirLight.target = mesh;
  base.scene.add(mesh);
  return mesh;
};

const createGUI = (dirLight, sphere) => {
  gui = new GUI();
  gui.add(sphere.position, "x").min(-5).max(5).step(0.1);
  gui
    .add(dirLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);
  gui.add(dirLight, "distance").min(0).max(10).step(0.01);
  gui.add(dirLight, "penumbra").min(0).max(1).step(0.01);
  gui.add(dirLight, "decay").min(0).max(5).step(0.01);
};

const createPlane = () => {
  const geo = new THREE.PlaneBufferGeometry(500, 500);
  const mat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotateX(Math.PI / 2);
  mesh.position.set(0, -1, 0);
  mesh.receiveShadow = true;
  base.scene.add(mesh);
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
