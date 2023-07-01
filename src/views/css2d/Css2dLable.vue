<script setup>
import Base from "../Base";
import { onMounted, onUpdated, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let canvasDom = ref(null);
let base, controls, gui, dirlight;
let moon, earth;
let labelrenderer = null;
onMounted(() => {
  base = new Base(canvasDom.value);
  base.camera.position.set(10, 5, 20);
  base.camera.layers.enableAll();
  base.camera.updateProjectionMatrix();
  window.addEventListener("resize", resize);
  createLabelRenderer();
  controls = new OrbitControls(base.camera, labelrenderer.domElement);
  createEarth();
  createMoon();
  base.addAmbientLight(0.6);
  dirlight = base.addDirLight();
  dirlight.position.set(-10, 10);
  dirlight.lookAt(0, 0, 0);
  createGUI();
  update();
});
let textureload = new THREE.TextureLoader();
//创建地球
function createEarth() {
  let sphere = new THREE.SphereGeometry(1, 32, 32);
  let mat = new THREE.MeshPhongMaterial({
    map: textureload.load("textures/planets/earth_atmos_2048.jpg"),
    //高光颜色
    specular: 0x333333,
    //高光强度
    shininess: 5,
    //高光贴图
    specularMap: textureload.load("textures/planets/earth_specular_2048.jpg"),
  });
  earth = new THREE.Mesh(sphere, mat);
  earth.position.set(0, 0, 0);
  base.scene.add(earth);
  earth.layers.enableAll();
  createEarthCSS2DObject();
}
//创建月球
function createMoon() {
  let sphere = new THREE.SphereGeometry(0.29, 16, 16);
  let mat = new THREE.MeshPhongMaterial({
    map: textureload.load("textures/planets/moon_1024.jpg"),
    //高光强度
    shininess: 5,
  });
  moon = new THREE.Mesh(sphere, mat);
  moon.position.set(5, 0, 0);
  base.scene.add(moon);
  moon.layers.enableAll();
  createMoonCSS2DObject();
}
//创建labelrenderer

function createLabelRenderer() {
  //创建一个renderer
  labelrenderer = new CSS2DRenderer();
  //设置一下他的宽高
  labelrenderer.setSize(window.innerWidth, window.innerHeight);
  //将他里面的dom元素设置为浮动，让他可以重叠在canvas上面
  labelrenderer.domElement.style.position = "absolute";
  labelrenderer.domElement.style.top = "0";
  document.body.appendChild(labelrenderer.domElement);
}
//创建地球label
function createEarthCSS2DObject() {
  //创建一下earth的名称label
  let earthdiv = document.createElement("div");
  earthdiv.textContent = "Earth";
  earthdiv.style.color = "white";
  earthdiv.style.fontSize = "14px";
  let earthlabel = new CSS2DObject(earthdiv);
  earthlabel.position.set(1.5, 0, 0); //相对于父物体的
  earthlabel.center.set(0, 1);
  earthlabel.layers.set(1);
  earth.add(earthlabel);

  //创建一下earth的质量label
  let earthweg = document.createElement("div");
  earthweg.textContent = "5.97237e24 kg";
  earthweg.style.color = "white";
  earthweg.style.fontSize = "14px";
  let earthweglabel = new CSS2DObject(earthweg);
  earthweglabel.position.set(1.5, 0, 0);
  earthweglabel.center.set(0, 0);
  earthweglabel.layers.set(2);
  earth.add(earthweglabel);
}
//创建月球label
function createMoonCSS2DObject() {
  //创建一下moon的名称label
  let moondiv = document.createElement("div");
  moondiv.textContent = "Moon";
  moondiv.style.color = "white";
  moondiv.style.fontSize = "12px";
  moondiv.style.backgroundColor = "transparent";
  let moonlabel = new CSS2DObject(moondiv);
  moonlabel.position.set(1.5 * 0.29, 0, 0);
  moonlabel.center.set(0, 1);
  moonlabel.layers.set(1);
  moon.add(moonlabel);

  //创建一下的质量label
  let moonweg = document.createElement("div");
  moonweg.textContent = "7.342e22 kg";
  moonweg.style.color = "white";
  moonweg.style.fontSize = "12px";
  //moonweg.style.backgroundColor = 'transparent';
  let moonweglabel = new CSS2DObject(moonweg);
  moonweglabel.position.set(1.5 * 0.29, 0, 0);
  moonweglabel.center.set(0, 0);
  moonweglabel.layers.set(2);
  moon.add(moonweglabel);
}
//创建gui
function createGUI() {
  let layers = {
    "Toggle to Layers 1": () => {
      base.camera.layers.toggle(1);
    },
    "Toggle to Layers 2": () => {
      base.camera.layers.toggle(2);
    },
    enableAll: () => {
      base.camera.layers.enableAll();
    },
    disableAll: () => {
      base.camera.layers.disableAll();
    },
  };
  gui = new GUI();
  gui.add(layers, "Toggle to Layers 1");
  gui.add(layers, "Toggle to Layers 2");
  gui.add(layers, "enableAll");
  gui.add(layers, "disableAll");
}
let elapsed;
let clock = new THREE.Clock();
function update() {
  requestAnimationFrame(update);
  elapsed = clock.getElapsedTime();
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
  controls.update();
  base.update();
  labelrenderer.render(base.scene, base.camera);
}
function resize() {
  base.resize();
  labelrenderer.setSize(window.innerWidth, window.innerHeight);
}
</script>

<template>
  <canvas ref="canvasDom" class="canvasDom"></canvas>
</template>

<style scoped>
.canvasDom {
  width: 100vw;
  height: 100vh;
}
</style>
