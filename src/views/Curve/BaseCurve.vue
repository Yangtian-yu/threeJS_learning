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
  update();
  // createEllipse();
  // createArc();
  // createCatmullRom3();
  // createCubicBezier();
  createCubicBezier3();
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

//#region 椭圆曲线
function createEllipse() {
  const curve = new THREE.EllipseCurve(
    0, //椭圆中心x的坐标
    0, // ax, aY椭 圆中心Y的坐标
    1, //x方向的半径
    1, // xRadius, yRadius  y方向的半径
    0, // 曲线开始的角度
    2 * Math.PI, // aStartAngle, aEndAngle  曲线结束的角度
    false, // aClockwise  // 是否按照顺时针绘制
    0 // aRotation //旋转角度
  );
  //50 : 细分数
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const ellipse = new THREE.Line(geometry, material);
  base.scene.add(ellipse);
}
//#endregion

//#region 弧线
function createArc() {
  const curve = new THREE.ArcCurve(
    0, //椭圆中心x的坐标
    0, // ax, aY椭 圆中心Y的坐标
    1, //x方向的半径
    0, // 曲线开始的角度
    Math.PI / 4, // aStartAngle, aEndAngle  曲线结束的角度
    false // aClockwise  // 是否按照顺时针绘制
  );
  //50 : 细分数
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const ellipse = new THREE.Line(geometry, material);
  base.scene.add(ellipse);
}
//#endregion

//#region 三维样条曲线
function createCatmullRom3() {
  //Create a closed wavey loop
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(-0.5, 0.5, 0.5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.5, -0.5, 0.5),
      new THREE.Vector3(1, 0, 1),
    ],
    true
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  base.scene.add(curveObject);
}
//#endregion

//#region 二维三次贝塞尔曲线
function createCubicBezier() {
  const curve = new THREE.CubicBezierCurve(
    new THREE.Vector2(-1, 0), //起点
    new THREE.Vector2(-0.5, 1.5), //控制点1
    new THREE.Vector2(2, 1.5), //控制点2
    new THREE.Vector2(1, 0) //终点
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  base.scene.add(curveObject);
}
//#endregion

//#region  三维三次贝塞尔曲线
function createCubicBezier3() {
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-0.5, 1.5, 0),
    new THREE.Vector3(2, 1.5, 0),
    new THREE.Vector3(1, 0, 0)
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  base.scene.add(curveObject);
}
//#endregion
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
