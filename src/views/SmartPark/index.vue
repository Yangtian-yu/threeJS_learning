<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "./three/Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import City from "./three/mesh/city";
let base, controls, city;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  city = new City(base.scene);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.camera.position.set(0, 0, 10);
  base.addAmbientLight(0.6);
  let dirlight = base.addDirLight();
  dirlight.position.set(10, 100, 10);
  dirlight.lookAt(0, 0, 0);
  addBackground();
  createAxesHelper();
  update();
  window.addEventListener("resize", resize);
});

const addBackground = () => {
  const hdrLoader = new RGBELoader();
  hdrLoader.loadAsync("ciityMaterial/textures/023.hdr").then((texture) => {
    base.scene.background = texture;
    base.scene.environment = texture;
    base.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  });
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(10);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

function update() {
  requestAnimationFrame(update);
  base.update();
  controls.update();
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
