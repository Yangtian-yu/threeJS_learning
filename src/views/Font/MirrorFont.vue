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
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
let base, controls;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  base.camera.position.z = 500;
  // base.camera.position.y = -1.5;
  base.scene.background = new THREE.Color(0x000000);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.8); //方向光
  dirLight.position.set(0, 0, 10);
  base.scene.fog = new THREE.Fog(0x000000, 100, 1000);
  update();
  createFont();
  createPlane();
  window.addEventListener("resize", resize);
});

//#region 创建文字
function createFont() {
  new FontLoader().load("fonts/gentilis_bold.typeface.json", (font) => {
    //第一个参数：字符串  第二个参数：大小
    // const shapes = font.generateShapes("three.js", 1);
    const shapeGeo = new TextGeometry("three.js", {
      font,
    });
    shapeGeo.computeBoundingBox();
    const t = new THREE.Vector3();
    shapeGeo.boundingBox.getCenter(t);
    t.negate();
    const mat = new THREE.MeshPhongMaterial({
      color: 0x006699,
    });
    const mesh = new THREE.Mesh(shapeGeo, mat);
    mesh.position.x = t.x;
    mesh.position.z = 2 * t.z;
    mesh.position.y = 35;
    base.scene.add(mesh);

    const mesh1 = new THREE.Mesh(shapeGeo, mat);
    mesh1.rotateX(Math.PI);
    mesh1.position.x = t.x;
    // mesh1.position.z = 35;
    mesh1.position.y = -35;
    base.scene.add(mesh1);
  });
}
//#endregion

function createPlane() {
  const plane = new THREE.PlaneGeometry(100000, 1000000);
  const mat = new THREE.MeshBasicMaterial({
    opacity: 0.65,
    transparent: true,
  });
  const mesh = new THREE.Mesh(plane, mat);
  mesh.rotateX(-Math.PI / 2);
  base.scene.add(mesh);
}

function update() {
  requestAnimationFrame(update);
  base.updated();
  controls.update();
}
function resize() {
  base.resize();
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
