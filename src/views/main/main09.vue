<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let base, controls;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  base.addAmbientLight(0.5);
  let dirLight = base.addDirLight(0.5);
  dirLight.position.set(-5, 9, 3);
  dirLight.castShadow = true; //可以投射阴影

  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 5);
  createAxesHelper();
  createSphere();
  createPlane();
  update();
  window.addEventListener("resize", resize);
});

const createSphere = () => {
  const geo = new THREE.SphereBufferGeometry(1, 20, 20);
  const mat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  base.scene.add(mesh);
};

const createPlane = () => {
  const geo = new THREE.PlaneBufferGeometry(10, 10);
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
