<template>
  <div>
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Base from "../Base";
import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader";
let base, track, css3drenderer, baseSprite, root;
//存储不同原子的颜色图片
const colorSpriteMap = {};
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  base.renderer.setSize(0, 0);
  // base.camera.position.z = 1000;
  root = new THREE.Object3D();
  base.scene.add(root);
  base.camera.position.z = 30;
  // controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);
  update();
  // createPDB();
  createImage();
  createCss3DRenderer();
  track = new TrackballControls(base.scene, css3drenderer.domElement);
  window.addEventListener("resize", resize);
});
function update() {
  requestAnimationFrame(update);
  // base.updated();
  css3drenderer?.render(base.scene, base.camera);
  // controls.update();
  track?.update();
}
function resize() {
  base.resize();
  css3drenderer.setSize(window.innerWidth, window.innerHeight);
}

function createPDB() {
  new PDBLoader().load("3.pdb", (obj) => {
    console.log(obj);
    let geometryAtoms = obj.geometryAtoms;
    let geometryBonds = obj.geometryBonds;
    let json = obj.json;
    let positionAtoms = geometryAtoms.getAttribute("position");
    let colorAtoms = geometryAtoms.getAttribute("color");
    let position = new THREE.Vector3();
    let color = new THREE.Vector3();
    //原子结构
    for (let i = 0; i < positionAtoms.count; i++) {
      position.fromBufferAttribute(positionAtoms, i);
      color.fromBufferAttribute(colorAtoms, i);
      let atomjson = json.atoms[i];
      let element = atomjson[4]; //元素名称
      if (!colorSpriteMap[element]) {
        //赋值
        let canvas = imageToCanvas(baseSprite);
        let context = canvas.getContext("2d");
        colorify(context, canvas.width, canvas.height, color);
        let url = canvas.toDataURL();
        colorSpriteMap[element] = url;
      }
      let ele = colorSpriteMap[element];
      let img = document.createElement("img");
      img.src = ele;
      img.width = 30;
      img.height = 30;
      //2d转3d
      let sprite = new CSS3DSprite(img);
      sprite.position.copy(position);
      sprite.position.multiplyScalar(75);
      root.add(sprite);
    }
    //键结构
    let positionbonds = geometryBonds.getAttribute("position");
    let start = new THREE.Vector3(); //开始点
    let end = new THREE.Vector3(); //开始点
    for (let i = 0; i < positionbonds.count; i += 2) {
      start.fromBufferAttribute(positionbonds, i);
      end.fromBufferAttribute(positionbonds, i + 1);
      start.multiplyScalar(75);
      end.multiplyScalar(75);
      let tmpVec1 = new THREE.Vector3();
      tmpVec1.subVectors(end, start);
      //长度
      let bomdLength = tmpVec1.length() - 50;
      //
      let div1 = document.createElement("div");
      div1.style.height = bomdLength + "px";
      div1.style.width = "5px";
      div1.style.backgroundColor = "red";
      let obj = new CSS3DObject(div1);
      obj.position.copy(start);
      //(end-start)*0.5  +  start
      //物体的中心点就是原点
      obj.position.lerp(end, 0.5);
      let yAxis = new THREE.Vector3(0, 1, 0);
      //旋转轴(叉乘)
      let axis = yAxis.clone().cross(tmpVec1);
      //旋转角度  点乘 |a| |b| *cos
      let radians = Math.acos(yAxis.clone().dot(tmpVec1.normalize()));
      obj.setRotationFromAxisAngle(axis.normalize(), radians);
      root.add(obj);
      //旋转90
      let div2 = document.createElement("div");
      div2.style.height = bomdLength + "px";
      div2.style.width = "5px";
      div2.style.backgroundColor = "red";
      let obj1 = new CSS3DObject(div2);
      obj1.position.copy(start);
      //(end-start)*0.5  +  start
      //物体的中心点就是原点
      obj1.position.lerp(end, 0.5);
      obj1.setRotationFromAxisAngle(axis.normalize(), radians);
      //延y轴旋转90度
      obj1.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      root.add(obj1);
    }
  });
}

function colorify(context, width, height, color) {
  let r = color.r;
  let g = color.g;
  let b = color.b;
  //得到像素数据
  let imamgeData = context.getImageData(0, 0, width, height);
  //颜色修改
  let data = imamgeData.data;
  for (let index = 0; index < data.length; index += 4) {
    data[index] *= r;
    data[index + 1] *= g;
    data[index + 2] *= b;
  }
  context.putImageData(imamgeData, 0, 0);
}

const imageToCanvas = (img) => {
  let width = img.width;
  let height = img.height;
  let canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  //2维绘图场景
  let context = canvas.getContext("2d");
  //将图片绘制到canvas上
  context.drawImage(img, 0, 0, width, height);
  return canvas;
};

function createImage() {
  baseSprite = document.createElement("img");
  baseSprite.src = "5.jpg";
  baseSprite.onload = () => {
    createPDB();
  };
}

//tupian
function create3DSprite() {
  let img = document.createElement("img");
  img.src = "1.jpg";
  img.height = 30;
  img.width = 30;
  let sprite = new CSS3DSprite(img);
  base.scene.add(sprite);
}

function create3DObject() {
  let div1 = document.createElement("div");
  div1.textContent = "DIV";
  div1.style.fontSize = "14px";
  let obj = new CSS3DObject(div1);
  base.scene.add(obj);
}

function createCss3DRenderer() {
  css3drenderer = new CSS3DRenderer();
  css3drenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(css3drenderer.domElement);
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
