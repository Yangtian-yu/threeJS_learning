<template>
  <div>
    <canvas ref="canvasDom" id="canvasDom"></canvas>
    <div id="menu">
      <button id="table">table</button>
      <button id="shpere">shpere</button>
      <button id="helix">helix</button>
      <button id="grid">grid</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Base from "../Base";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "three/examples/jsm/libs/tween.module.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { table } from "./data";
let base, controls, renderer3d;
let objects = [];
const targets = {
  Table: [],
  Helix: [],
  Shpere: [],
  Grid: [],
};
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  base.renderer.setSize(0, 0);
  base.camera.position.z = 2800;
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);
  createItems();
  createTable();
  createHelix();
  createGrid();
  createShpere();
  createCss3DRenderer();
  addListener();
  controls = new OrbitControls(base.camera, renderer3d.domElement);
  controls.enableDamping = true;
  update();
  window.addEventListener("resize", resize);
});
function update() {
  requestAnimationFrame(update);
  // base.update();
  TWEEN.update();
  renderer3d.render(base.scene, base.camera);
  controls.update();
}
function resize() {
  base.resize();
  base.renderer.setSize(0, 0);
  renderer3d.setSize(window.innerWidth, window.innerHeight);
}

const createCss3DRenderer = () => {
  renderer3d = new CSS3DRenderer();
  renderer3d.setSize(window.innerWidth, window.innerHeight);
  renderer3d.domElement.style.backgroundColor = "black";
  document.body.appendChild(renderer3d.domElement);
};

const createItems = () => {
  for (let i = 0; i < table.length; i += 5) {
    //父容器
    let element = document.createElement("div");
    element.style.backgroundColor = `rabg(0,127,127,${
      Math.random() * 0.5 + 0.2
    })`;
    element.className = "element";
    let number = document.createElement("div");
    number.className = "number";
    //索引
    number.textContent = i / 5 + 1;
    element.appendChild(number);
    //元素字母
    let symbol = document.createElement("div");
    symbol.className = "symbol";
    symbol.textContent = table[i];
    element.appendChild(symbol);
    //详细信息
    let details = document.createElement("div");
    details.className = "details";
    details.innerHTML = table[i + 1] + "<br>" + table[i + 2];
    element.appendChild(details);
    let obj = new CSS3DObject(element);
    objects.push(obj);
    base.scene.add(obj);
  }
};

//制作table
const createTable = () => {
  for (let i = 0; i < table.length; i += 5) {
    objects[i / 5].position.x = table[i + 3] * 140 - 1500;
    objects[i / 5].position.y = -table[i + 4] * 180 + 1100;
    let obj = objects[i / 5];
    targets.Table.push({
      position: obj.position.clone(),
    });
  }
};

//螺旋状效果
const createHelix = () => {
  for (let i = 0; i < objects.length; i++) {
    let theta = i * 0.175;
    let y = -i * 8 + 450;
    objects[i].position.setFromCylindricalCoords(900, theta, y);
    let obj = new THREE.Object3D();
    obj.position.copy(objects[i].position);
    obj.lookAt(0, objects[i].position.y, 0);
    objects[i].rotation.x = obj.rotation.x;
    objects[i].rotation.y = obj.rotation.y + Math.PI;
    objects[i].rotation.z = obj.rotation.z;
    let obj1 = objects[i];
    targets.Helix.push({
      position: obj1.position.clone(),
      rotation: obj1.rotation.clone(),
    });
  }
};

//网格状
const createGrid = () => {
  for (let i = 0; i < objects.length; i++) {
    objects[i].position.x = (i % 5) * 400 - 400;
    objects[i].position.y = (Math.floor(i / 5) % 5) * 400;
    objects[i].position.z = 2000 - Math.floor(i / 25) * 800;
    targets.Grid.push({
      position: objects[i].position.clone(),
    });
  }
  base.camera.position.z = 3200;
};

//球形
const createShpere = () => {
  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    //该点的位矢在 x - y 平面上的投影与 x 轴的夹角(0-pi)
    const phi = Math.acos(-1 + (2 * i) / objects.length);
    //该点的位矢与 z 轴的夹角(0-2pi)
    const theta = Math.sqrt(objects.length * Math.PI) * phi;
    object.position.setFromSphericalCoords(800, phi, theta);
    let obj = new THREE.Object3D();
    obj.position.copy(object.position);
    obj.lookAt(0, 0, 0);
    object.rotation.x = obj.rotation.x;
    object.rotation.y = obj.rotation.y;
    object.rotation.z = obj.rotation.z;
    object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    targets.Shpere.push({
      position: object.position.clone(),
      rotation: object.rotation.clone(),
    });
  }
};

function addListener() {
  console.log(targets.Table);
  console.log(targets.Shpere);
  console.log(targets.Helix);
  console.log(targets.Grid);
  document.getElementById("table").addEventListener("click", () => {
    transform(targets.Table, 2000);
  });
  document.getElementById("shpere").addEventListener("click", () => {
    transform(targets.Shpere, 2000);
  });
  document.getElementById("helix").addEventListener("click", () => {
    transform(targets.Helix, 2000);
  });
  document.getElementById("grid").addEventListener("click", () => {
    transform(targets.Grid, 2000);
  });
}

function transform(target, duration) {
  TWEEN.removeAll();
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const targetVal = target[i];
    new TWEEN.Tween(object.position)
      .to(
        {
          x: targetVal.position.x,
          y: targetVal.position.y,
          z: targetVal.position.z,
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    if (targetVal.rotation) {
      new TWEEN.Tween(object.rotation)
        .to(
          {
            x: targetVal.rotation.x,
            y: targetVal.rotation.y,
            z: targetVal.rotation.z,
          },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    } else {
      new TWEEN.Tween(object.rotation)
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }
  }
  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(() => {
      renderer3d.render(base.scene, base.camera);
    })
    .start();
}
</script>

<style>
#canvasDom {
  width: 100%;
  height: 100%;
}
.element {
  width: 120px;
  height: 160px;
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center;
}

.element:hover {
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .number {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

.element .symbol {
  position: absolute;
  top: 40px;
  left: 0px;
  right: 0px;
  font-size: 60px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
}

.element .details {
  position: absolute;
  bottom: 15px;
  left: 0px;
  right: 0px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

#menu {
  position: absolute;
  z-index: 9999;
  bottom: 0;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
#menu button {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  padding: 5px 10px;
  cursor: pointer;
}
#menu button:hover {
  background-color: rgba(0, 255, 255, 0.5);
}
</style>
