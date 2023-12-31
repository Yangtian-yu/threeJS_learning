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
  let dirLight = base.addDirLight(0.5);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true; //可以投射阴影
  //设置阴影贴图模糊度
  dirLight.shadow.radius = 20;
  //设置阴影贴图的分辨率
  dirLight.shadow.mapSize.set(4096, 4096);
  //设置平行光投射相机的属性
  dirLight.shadow.camera.naer = 0.5;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.top = 5;
  dirLight.shadow.camera.bottom = -5;
  dirLight.shadow.camera.left = -5;
  dirLight.shadow.camera.right = 5;
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 5);
  createAxesHelper();
  createSphere();
  createPlane();
  createGUI(dirLight);
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

const createGUI = (dirLight) => {
  gui = new GUI();
  gui
    .add(dirLight.shadow.camera, "near")
    .min(0)
    .max(10)
    .step(0.1)
    .onChange(() => {
      dirLight.shadow.camera.updateProjectionMatrix();
    });
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
