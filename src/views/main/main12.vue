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
  base.camera.position.set(0, 0, 8);
  createAxesHelper();
  createInteractionScene();
  update();
  window.addEventListener("resize", resize);
});

const createInteractionScene = () => {
  //100个立方体
  let cubeArr = [];
  const geo = new THREE.BoxBufferGeometry(1, 1, 1);
  delete geo.attributes.uv;
  const mat = new THREE.MeshBasicMaterial({
    wireframe: true,
  });
  const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      for (let z = -5; z < 5; z++) {
        const cube = new THREE.Mesh(geo, mat);
        cube.position.set(i, j, z);
        base.scene.add(cube);
        cubeArr.push(cube);
      }
    }
  }
  //鼠标的位置对象
  const mouse = new THREE.Vector2();
  //创建投射光线对象
  const raycaster = new THREE.Raycaster();
  // //监听鼠标的位置
  // window.addEventListener("mousemove", (e) => {
  //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  //   // 通过摄像机和鼠标位置更新射线
  //   raycaster.setFromCamera(mouse, base.camera);
  //   // // 计算物体和射线的焦点
  //   let result = raycaster.intersectObjects(cubeArr);
  //   if (result.length) {
  //     result[0].object.material = redMat;
  //   }
  // });

  // 监听鼠标的位置
  window.addEventListener("click", (event) => {
    //   console.log(event);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, base.camera);
    let result = raycaster.intersectObjects(cubeArr);
    //   console.log(result);
    //   result[0].object.material = redMaterial;
    result.forEach((item) => {
      item.object.material = redMat;
    });
  });
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(20);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

const clock = new THREE.Clock();

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
