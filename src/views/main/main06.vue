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
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 10);
  addTexture();
  createAxesHelper();
  update();
  window.addEventListener("resize", resize);
});

const addTexture = () => {
  //导入纹理
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  //材质
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
  });
  const mesh = new THREE.Mesh(geo, mat);
  base.scene.add(mesh);
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(10);
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
