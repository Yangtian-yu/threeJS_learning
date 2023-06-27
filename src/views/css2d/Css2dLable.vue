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
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

let base, controls, moon, earth, labelrenderer, gui;
const canvasDom = ref(null);
let textureLoader = new THREE.TextureLoader();

onMounted(() => {
  gui = new GUI();
  base = new Base(canvasDom.value);
  base.camera.position.set(10, 5, 10);
  createCss2DRenderer();
  controls = new OrbitControls(base.camera, labelrenderer.domElement);
  base.addAmbientLight(0.6); //环境光
  let dirLight = base.addDirLight(); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);
  const helper = new THREE.DirectionalLightHelper(dirLight, 5);
  // base.scene.add(helper);
  update();
  const axesHelper = new THREE.AxesHelper(5);
  base.scene.add(axesHelper);
  createEarth();
  createMoon();
  createGUI();
  window.addEventListener("resize", resize);
});

let clock = new THREE.Clock();
let elapsed = 0;

function update() {
  requestAnimationFrame(update);
  elapsed = clock.getElapsedTime();
  // console.log(elapsed);
  moon?.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
  base.updated();
  controls.update();
  labelrenderer.render(base.scene, base.camera);
}
function resize() {
  base.resize();
  labelrenderer.setSize(window.innerWidth, window.innerHeight);
}

//创建gui
function createGUI() {
  let layers = {
    "Toggle to layers1": () => {
      base.camera.layers.toggle(1);
    },
    "Toggle to layers2": () => {
      base.camera.layers.toggle(2);
    },
    enableAll: () => {
      base.camera.layers.enableAll();
    },
    disableAll: () => {
      base.camera.layers.disableAll();
    },
  };
  gui.add(layers, "Toggle to layers1");
  gui.add(layers, "Toggle to layers2");
  gui.add(layers, "enableAll");
  gui.add(layers, "disableAll");
}

//创建 css2drenderer
function createCss2DRenderer() {
  labelrenderer = new CSS2DRenderer();
  labelrenderer.setSize(window.innerWidth, window.innerHeight);
  labelrenderer.domElement.style.position = "absolute";
  labelrenderer.domElement.style.top = "0";
  document.body.appendChild(labelrenderer.domElement);
}

//创建地球的label
function createEarthCss2DObject() {
  let rearthdiv = document.createElement("div");
  rearthdiv.textContent = "Earth";
  rearthdiv.style.color = "#ffffff";
  rearthdiv.style.fontSize = "12px";
  let obj = new CSS2DObject(rearthdiv);
  obj.position.set(1.5, 0, 0);
  obj.center.set(0, 1);
  obj.layers.set(1);
  earth.add(obj);

  let rearthwediv = document.createElement("div");
  rearthwediv.textContent = "5.97237e24 kg";
  rearthwediv.style.color = "#ffffff";
  rearthwediv.style.fontSize = "12px";
  let weiobj = new CSS2DObject(rearthwediv);
  weiobj.position.set(1.5, 0, 0);
  weiobj.center.set(0, 0);
  weiobj.layers.set(2);
  earth.add(weiobj);
}

//创建月球的label
function createMoonCss2DObject() {
  let moondiv = document.createElement("div");
  moondiv.textContent = "Moon";
  moondiv.style.color = "#ffffff";
  moondiv.style.fontSize = "12px";
  let obj = new CSS2DObject(moondiv);
  obj.position.set(0.5, 0, 0);
  obj.center.set(0, 1);
  obj.layers.set(1);
  moon.add(obj);

  let moonwediv = document.createElement("div");
  moonwediv.textContent = "7.342e22 kg";
  moonwediv.style.color = "#ffffff";
  moonwediv.style.fontSize = "12px";
  let weiobj = new CSS2DObject(moonwediv);
  weiobj.position.set(0.5, 0, 0);
  weiobj.center.set(0, 0);
  weiobj.layers.set(2);
  moon.add(weiobj);
}

//月球
function createMoon() {
  const geometry = new THREE.SphereGeometry(0.29, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    map: textureLoader.load("moon.jpg"),
    //高光效果
    //强度
    shininess: 5,
  });
  moon = new THREE.Mesh(geometry, material);
  moon.position.x = 5;
  moon.layers.enableAll();
  createMoonCss2DObject();
  base.scene.add(moon);
}

//地球
function createEarth() {
  //   构造器
  // SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
  // radius — 球体半径，默认为1。
  // widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为32。
  // heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为16。
  // phiStart — 指定水平（经线）起始角度，默认值为0。。
  // phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
  // thetaStart — 指定垂直（纬线）起始角度，默认值为0。
  // thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI。
  // 该几何体是通过扫描并计算围绕着Y轴（水平扫描）和X轴（垂直扫描）的顶点来创建的。
  //  因此，不完整的球体（类似球形切片）可以通过为phiStart，phiLength，
  //  thetaStart和thetaLength设置不同的值来创建， 以定义我们开始（或结束）计算这些顶点的起点（或终点）。
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    map: textureLoader.load("earth.jpg"),
    //高光效果
    //颜色
    specular: 0x333333,
    //强度
    shininess: 5,
    //高光贴图   黑白图片，白色代表高光，黑色不会反射高光
    specularMap: null,
    //specularMap:textureLoader.load("***"),
    // 法线贴图
    normalMap: null,
    // normalMap:textureLoader.load("***")
    //法线贴图对物体的影响
    // normalScale:
  });
  earth = new THREE.Mesh(geometry, material);
  earth.layers.enableAll();
  createEarthCss2DObject();
  base.scene.add(earth);
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
