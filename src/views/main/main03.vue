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
  base.camera.position.set(0, 0, 10);
  createBox();
  createAxesHelper();
  update();
  console.log(base);
  window.addEventListener("resize", resize);
});

const createBox = () => {
  //添加物体
  //创建几何体
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(cube, mat);

  //修改物体的位置
  // mesh.position.set(5, 0, 0);

  base.scene.add(mesh);
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(10);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

// 设置时钟
const clock = new THREE.Clock();

function update() {
  const mesh = base.scene.children[0];

  //#region 物体移动
  // mesh.position.x += 0.01;
  // if (mesh.position.x > 5) {
  //   mesh.position.x = 0.5;
  // }
  //按照帧率运动
  // let t = (time / 1000) % 5;
  // mesh.position.x = t * 1;
  //#endregion

  //#region 物体 缩放
  // mesh.scale.set(3, 2, 1);
  // mesh.scale.x = 5;
  //#endregion

  //#region 物体 旋转
  // mesh.rotation.set(Math.PI / 4, 0, 0);
  //#endregion

  //#region   threejs自带时钟 clock
  //获取时间的总时长
  let time = clock.getElapsedTime();
  let t = time % 5;
  mesh.position.x = t * 1;
  // let deltaTime = clock.getDelta();
  // console.log("时钟运行总时长:", time);
  // console.log("两次获取时间的间隔时间:", deltaTime); //0
  //#endregion

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
