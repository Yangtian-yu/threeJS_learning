<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入connon引擎
import * as CANNON from "cannon-es";
let base, controls;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  base.addDirLight();
  base.addDirLight();
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.camera.position.set(0, 0, 10);
  createPlane();
  update();
  window.addEventListener("resize", resize);
});

const createPlane = () => {
  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial()
  );
  floor.position.set(0, -5, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  base.scene.add(floor);
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
