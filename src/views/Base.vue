<template>
  <div>
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Base from "./Base";
import * as THREE from "three";
let base;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  update();
  createBox();
  window.addEventListener("resize", resize);
});
function update() {
  requestAnimationFrame(update);
  base.updated();
}
function resize() {
  base.resize();
}
function createBox() {
  //存放的是一些位置信息（不是实体）
  let box = new THREE.BoxGeometry(1, 1, 1);
  let mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  let mesh = new THREE.Mesh(box, mat);
  base.scene.add(mesh);
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
