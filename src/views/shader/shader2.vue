<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//顶点着色器
import basicVertexShader from "../shader/shader/basic/vertex.glsl";
//片元着色器
import basicFragmentShader from "./shader/basic/fragment.glsl";
let base, controls;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight();
  base.addDirLight();
  base.camera.position.set(0, 0, 10);
  createPlane();
  createAxesHelper();
  update();
  window.addEventListener("resize", resize);
});

const createPlane = () => {
  const shaerMat = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
  });
  //添加物体
  //创建几何体
  const cube = new THREE.PlaneBufferGeometry(1, 1, 64, 64);
  const mat = shaerMat;
  const mesh = new THREE.Mesh(cube, mat);
  console.log(mesh);
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
