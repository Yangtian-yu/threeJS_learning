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
  // createBox();
  createTriangle();
  createAxesHelper();
  update();
  window.addEventListener("resize", resize);
});

// const createBox = () => {
//   //添加物体
//   //创建几何体
//   const geometry = new THREE.BufferGeometry(1, 1, 1);
//   const vertices = new Float32Array([
//     -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

//     1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
//   ]);
//   geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
//   const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//   const mesh = new THREE.Mesh(geometry, mat);

//   //修改物体的位置
//   // mesh.position.set(5, 0, 0);
//   base.scene.add(mesh);
// };

//创建三角形
const createTriangle = () => {
  for (let i = 0; i < 50; i++) {
    //每一个三角形，需要3个顶点，每个顶点需要3个值
    const geometry = new THREE.BufferGeometry(1, 1, 1);
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
      positionArray[j] = Math.random() * 10 - 5;
    }
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    base.scene.add(mesh);
  }
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
