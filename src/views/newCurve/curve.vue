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
} from "three/examples/jsm/renderers/CSS2DRenderer";
let base, controls;
let moon, earth, curveObject, curve;
const canvasDom = ref(null);
let textureload = new THREE.TextureLoader();
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  base.camera.position.z = 10;
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);
  update();
  createEarth();
  createMoon();
  createBox();
  createCyrve();
  window.addEventListener("resize", resize);
});

function createCyrve() {
  //Create a closed wavey loop
  curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-10, 0, 10),
      new THREE.Vector3(-5, 5, 5),
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(5, -5, 5),
      new THREE.Vector3(10, 0, 10),
    ],
    true
  );

  //在曲线里，getPoint获取51个点
  const points = curve.getPoints(500);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  curveObject = new THREE.Line(geometry, material);
  base.scene.add(curveObject);
}

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
  // createEarthCSS2DObject();
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
  // createMoonCSS2DObject();
}

function createBox() {
  //存放的是一些位置信息（不是实体）
  let box = new THREE.BoxGeometry(1, 1, 1);
  let mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  let mesh = new THREE.Mesh(box, mat);
  base.scene.add(mesh);
}

const clock = new THREE.Clock();

function update() {
  requestAnimationFrame(update);
  const elapsed = clock.getElapsedTime();
  const time = (elapsed * 0.1) % 1;
  const point = curve?.getPoint(time);
  if (point) {
    moon?.position.copy(point);
    base.camera.lookAt(earth.position);
    base.camera.position.copy(point);
  }
  base.update();
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
