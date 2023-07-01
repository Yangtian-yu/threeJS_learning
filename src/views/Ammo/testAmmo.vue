<template>
  <div>
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Base from "../Base";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let base, controls, mesh1;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  base.camera.position.set(0, 20, 180);
  base.camera.lookAt(0, 0.5, 0);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.45); //环境光
  let dirLight = base.addDirLight(0.45); //方向光
  dirLight.position.set(-5, 9, 3);
  dirLight.lookAt(0, 0, 0);
  dirLight.castShadow = true; //可以投射阴影
  let d = 10;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  // createBox();
  createObjects();
  update();
  window.addEventListener("resize", resize);
});

let gravity = 9.8; //重力加速度
let clock = new THREE.Clock();

function update() {
  requestAnimationFrame(update);
  base.update();
  controls.update();
  if (mesh1.position.y <= 0.5) {
    mesh1.position.y = 0.5;
    return;
  }
  let t = clock.getElapsedTime();
  mesh1.position.y -= gravity * t * t * 0.1;
}
function resize() {
  base.resize();
}

const createObjects = () => {
  //网格
  let plane = new THREE.PlaneGeometry(100, 100);
  let mat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  let mesh = new THREE.Mesh(plane, mat);
  mesh.rotateX(-Math.PI / 2);
  mesh.receiveShadow = true;
  base.scene.add(mesh);
  //立方体
  let box = new THREE.BoxGeometry(1, 1, 1);
  let mat1 = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    // side: THREE.DoubleSide,
  });
  mesh1 = new THREE.Mesh(box, mat1);
  mesh1.position.y = 10;
  mesh1.receiveShadow = true;
  mesh1.castShadow = true;
  base.scene.add(mesh1);
};

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
