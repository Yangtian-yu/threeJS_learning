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
let base, controls;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  base.camera.position.z = 3;
  base.camera.position.y = -1.5;
  base.scene.background = new THREE.Color(0xffffff);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-20, 10, 10);
  update();
  createFont();
  window.addEventListener("resize", resize);
});

//#region 创建文字
function createFont() {
  new FontLoader().load("fonts/gentilis_bold.typeface.json", (font) => {
    //第一个参数：字符串  第二个参数：大小
    const shapes = font.generateShapes("three.js", 1);
    const shapeGeo = new THREE.ShapeGeometry(shapes);
    shapeGeo.computeBoundingBox();
    const t = new THREE.Vector3();
    shapeGeo.boundingBox.getCenter(t);
    t.negate();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
      opacity: 0.4,
      transparent: true,
    });
    const mesh = new THREE.Mesh(shapeGeo, mat);
    mesh.position.x = t.x;
    mesh.position.z = -1;
    base.scene.add(mesh);
    console.log(shapes);
    const lines = new THREE.Object3D();
    const Linemat = new THREE.LineBasicMaterial({ color: 0x00ffff });
    for (let index = 0; index < shapes.length; index++) {
      const shape = shapes[index];
      console.log(shape.holes);
      if (shape.holes) {
        for (let i = 0; i < shape.holes.length; i++) {
          const element = shape.holes[i];
          const points = element.getPoints(); //得到曲线上的一组点位
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geo, Linemat);
          line.position.x = t.x;
          lines.add(line);
        }
      }
      const points = shape.getPoints(); //得到曲线上的一组点位
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, Linemat);
      line.position.x = t.x;
      lines.add(line);
    }
    base.scene.add(lines);
  });
}
//#endregion

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
