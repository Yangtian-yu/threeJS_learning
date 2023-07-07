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
  //创建球几何体
  const geo = new THREE.SphereBufferGeometry(3, 30, 30);
  delete geo.attributes.uv;
  // const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  // const mesh = new THREE.Mesh(geo, mat);
  // base.scene.add(mesh);
  const TextureLoader = new THREE.TextureLoader();
  const texture = TextureLoader.load("matter/textures/particles/1.png");
  const pointMat = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xfff000,
    map: texture,
    sizeAttenuation: true,
    alphaMap: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const point = new THREE.Points(geo, pointMat);
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
