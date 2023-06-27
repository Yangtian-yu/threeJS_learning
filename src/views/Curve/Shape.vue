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

let base, controls;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);
  update();
  // createBox();
  // createShape();
  createSmile();
  window.addEventListener("resize", resize);
});
function update() {
  requestAnimationFrame(update);
  base.updated();
  controls.update();
}
function resize() {
  base.resize();
}

//#region
function createShape() {
  const heartShape = new THREE.Shape();

  heartShape.moveTo(0, 0);
  heartShape.lineTo(2, 0);
  heartShape.lineTo(2, 2);
  heartShape.lineTo(0, 2);
  heartShape.lineTo(0, 0);

  heartShape.holes.push(
    new THREE.Path()
      .moveTo(0.5, 0.5)
      .lineTo(1.5, 0.5)
      .lineTo(1.5, 1.5)
      .lineTo(0.5, 1.5)
      .lineTo(0.5, 0.5)
  );
  const extrudeSettings = {
    depth: 8,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(heartShape);

  const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
  base.scene.add(mesh);
}
//#endregion

//#region
function createSmile() {
  const shape = new THREE.Shape().absarc(0, 0, 1, 0, 2 * Math.PI);
  shape.holes.push(new THREE.Path().absarc(-0.4, 0.4, 0.2, 0, 2 * Math.PI)); //左眼睛
  shape.holes.push(new THREE.Path().absarc(0.4, 0.4, 0.2, 0, 2 * Math.PI)); //左眼睛
  shape.holes.push(
    new THREE.Path()
      .moveTo(-0.4, -0.25)
      .bezierCurveTo(-0.5, -0.3, 0, -0.8, 0.4, -0.3)
      .bezierCurveTo(0.4, -0.3, 0, -0.65, 0.4, -0.3)
  );
  const geo = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x00fffff,
    side: THREE.DoubleSide,
  });
  let mash = new THREE.Mesh(geo, mat);
  base.scene.add(mash);
}
//#endregion

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
