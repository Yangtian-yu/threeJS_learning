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
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier";
let base, controls, flow;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.2); //环境光
  let dirLight = base.addDirLight(0.55); //方向光
  dirLight.position.set(0, 10, 10);
  base.camera.position.set(0, 2, 4);
  base.camera.lookAt(0, 0, 0);
  base.camera.updateProjectionMatrix();
  update();
  createMoveFont();
  window.addEventListener("resize", resize);
});

function update() {
  requestAnimationFrame(update);
  base.updated();
  controls.update();
  flow?.moveAlongCurve(-0.002); //参数：代表速度
}
function resize() {
  base.resize();
}

//#region
function createMoveFont() {
  //曲线
  //Create a closed wavey loop
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(-1, 0, 1),
    ],
    true
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  base.scene.add(curveObject);

  // 加载文字
  new FontLoader().load("fonts/gentilis_bold.typeface.json", (font) => {
    console.log(font);
    const textGeo = new TextGeometry("Hello three.js!", {
      font: font,
      size: 0.2,
      height: 0.05,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 5,
    });
    textGeo.rotateX(Math.PI);
    let mat = new THREE.MeshStandardMaterial({ color: 0x99ffff });
    let mesh = new THREE.Mesh(textGeo, mat);
    flow = new Flow(mesh);
    flow.updateCurve(0, curve); //第一个参数是索引，第二个参数是曲线
    console.log(flow);
    base.scene.add(flow.object3D);
  });
}
//#endregion
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
