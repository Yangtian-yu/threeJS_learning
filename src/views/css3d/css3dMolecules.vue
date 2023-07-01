<script setup>
import Base from "../Base";
import { onMounted, onUpdated, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader";
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer";
let canvasDom = ref(null);
let base, controls, gui;
let renderer3d;
let colorSpriteMap = {};
let basesprite;
let root;
onMounted(() => {
  base = new Base(canvasDom.value);
  base.renderer.setSize(0, 0);
  // base.scene.background=new THREE.Color(0x0000ff)
  base.camera.position.z = 1000;
  root = new THREE.Object3D();
  base.scene.add(root);
  createBaseSprite();
  createCSS3DRenderer();

  window.addEventListener("resize", resize);
  controls = new OrbitControls(base.camera, renderer3d.domElement);
  update();
});
//创建CSS3DRenderer
function createCSS3DRenderer() {
  renderer3d = new CSS3DRenderer();
  renderer3d.setSize(window.innerWidth, window.innerHeight);
  //从中心向外辐射的椭圆渐变
  renderer3d.domElement.style.background =
    "radial-gradient(ellipse at center, rgba(43, 45, 48, 1) 0%, rgba(0, 0, 0, 1) 100%)";
  document.body.appendChild(renderer3d.domElement);
}
function createPDBLoader() {
  new PDBLoader().load("models/pdb/caffeine.pdb", (obj) => {
    let geometryAtoms = obj.geometryAtoms;
    let geometryBonds = obj.geometryBonds;
    let json = obj.json;
    // console.log(geometryAtoms,geometryBonds,json)
    let position = new THREE.Vector3(); //存储原子的位置
    let color = new THREE.Color(); //存储原子的颜色

    let positionAtoms = geometryAtoms.getAttribute("position");
    let colorAtoms = geometryAtoms.getAttribute("color");
    //原子
    for (let i = 0; i < positionAtoms.count; i++) {
      position.fromBufferAttribute(positionAtoms, i);
      color.fromBufferAttribute(colorAtoms, i);
      let atomjson = json.atoms[i]; //拿到json.atoms数组中的每一项
      let element = atomjson[4];
      // console.log(element)
      //如果没有这个值
      if (!colorSpriteMap[element]) {
        let canvas = imageToCanvas(basesprite);
        let context = canvas.getContext("2d");
        colorify(context, canvas.width, canvas.height, color);
        let dataurl = canvas.toDataURL();
        colorSpriteMap[element] = dataurl;
      }
      let colorsprite = colorSpriteMap[element];
      let atom = document.createElement("img");
      atom.src = colorsprite;
      let obj = new CSS3DSprite(atom);
      obj.position.copy(position);
      obj.position.multiplyScalar(75);
      root.add(obj);
    }
    //键
    let positionBonds = geometryBonds.getAttribute("position");
    let start = new THREE.Vector3(); //开始位置
    let end = new THREE.Vector3(); //结束位置
    for (let i = 0; i < positionBonds.count; i += 2) {
      start.fromBufferAttribute(positionBonds, i);
      end.fromBufferAttribute(positionBonds, i + 1);
      start.multiplyScalar(75);
      end.multiplyScalar(75);
      //end-start
      let tmpVec1 = new THREE.Vector3();
      //得到向量
      tmpVec1.subVectors(end, start);
      let bondLength = tmpVec1.length();

      let bond = document.createElement("div");
      bond.className = "bond";
      bond.style.height = bondLength + "px";
      bond.style.width = "5px";
      bond.style.backgroundColor = "red";
      let object = new CSS3DObject(bond);
      object.position.copy(start);
      object.position.lerp(end, 0.5); //得到中点

      //y轴
      let yAxis = new THREE.Vector3(0, 1, 0);
      //得到旋转轴
      let axis = yAxis.clone().cross(tmpVec1); //叉乘
      //得到旋转弧度
      let radians = Math.acos(yAxis.clone().dot(tmpVec1.clone().normalize()));
      //点乘
      object.setRotationFromAxisAngle(axis.normalize(), radians);
      const axesHelper = new THREE.AxesHelper(5);
      base.scene.add(axesHelper);
      root.add(object);

      //旋转90度
      let bond1 = document.createElement("div");
      // bond.className='bond'
      bond1.style.height = bondLength - 50 + "px";
      bond1.style.width = "5px";
      bond1.style.backgroundColor = "red";
      let object1 = new CSS3DObject(bond1);
      object1.position.copy(start);
      object1.position.lerp(end, 0.5); //得到中点
      object1.setRotationFromAxisAngle(axis.normalize(), radians);
      console.log(object1.rotation.y);
      object1.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      root.add(object1);
    }
  });
}
//将图片赋值到canvas上
function imageToCanvas(image) {
  let width = image.width;
  let height = image.height;
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}
//赋值颜色
function colorify(context, width, height, color) {
  let r = color.r,
    g = color.g,
    b = color.b;
  //得到像素数据
  let imageData = context.getImageData(0, 0, width, height);
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] *= r;
    data[i + 1] *= g;
    data[i + 2] *= b;
  }
  context.putImageData(imageData, 0, 0);
}
function createBaseSprite() {
  basesprite = document.createElement("img");
  basesprite.src = "textures/sprites/ball.png";
  basesprite.onload = () => {
    createPDBLoader();
  };
}
function update() {
  requestAnimationFrame(update);
  controls.update();
  renderer3d.render(base.scene, base.camera);
}
function resize() {
  // base.resize()
  base.camera.aspect = window.innerWidth / window.innerHeight;
  base.camera.updateProjectionMatrix();
  renderer3d.setSize(window.innerWidth, window.innerHeight);
}
</script>

<template>
  <canvas ref="canvasDom" class="canvasDom"></canvas>
</template>

<style scoped>
body {
  width: 100%;
  height: 100%;
  background-color: #050505;
  background: radial-gradient(
    ellipse at center,
    rgba(43, 45, 48, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}
.canvasDom {
  width: 100vw;
  height: 100vh;
}
</style>
