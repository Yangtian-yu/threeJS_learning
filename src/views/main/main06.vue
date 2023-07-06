<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let base, controls;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 10);
  addTexture();
  createAxesHelper();
  createPlane();
  update();
  window.addEventListener("resize", resize);
});

const addTexture = () => {
  //导入纹理
  const textureLoader = new THREE.TextureLoader();
  const doorColorTexture = textureLoader.load("matter/textures/door/color.jpg");
  const doorAplhaTexture = textureLoader.load("matter/textures/door/alpha.jpg");
  const doorAmbientTexture = textureLoader.load(
    "matter/textures/door/ambientOcclusion.jpg"
  );

  // const texture = textureLoader.load("matter/textures/minecraft.png");
  //设置纹理偏移
  // doorColorTexture.offset.x = 0.5;
  // doorColorTexture.offset.y = 0.5;
  // doorColorTexture.offset.set(0.5,0.5)
  //设置旋转的原点
  // doorColorTexture.center.set(0.5, 0.5);
  //设置纹理的旋转 旋转45deg
  // doorColorTexture.rotation = Math.PI / 4;
  //设置纹理的重复
  // doorColorTexture.repeat.set(2, 3);
  //设置纹理重复的模式
  // doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
  // doorColorTexture.wrapT = THREE.RepeatWrapping;

  //textTure纹理显示设置
  // texture.minFilter = THREE.NearestFilter;
  // texture.magFilter = THREE.NearestFilter;
  // texture.minFilter = THREE.LinearFilter;
  // texture.magFilter = THREE.LinearFilter;

  const geo = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
  //材质
  const mat = new THREE.MeshBasicMaterial({
    color: "#ffff00",
    map: doorColorTexture,
    alphaMap: doorAplhaTexture,
    transparent: true,
    aoMap: doorAmbientTexture,
    aoMapIntensity: 1,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  base.scene.add(mesh);
  //mesh设置第二组uv
  geo.setAttribute(
    "uv2",
    new THREE.BufferAttribute(geo.attributes.uv.array, 2)
  );
};

const createPlane = () => {
  const textureLoader = new THREE.TextureLoader();
  const doorColorTexture = textureLoader.load("matter/textures/door/color.jpg");
  const doorAmbientTexture = textureLoader.load(
    "matter/textures/door/ambientOcclusion.jpg"
  );
  const plane = new THREE.PlaneBufferGeometry(1, 1);
  const mat = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
    color: 0xffff00,
    // opacity: 0.3,
    transparent: true,
    side: THREE.DoubleSide,
    aoMap: doorAmbientTexture,
  });
  const mesh = new THREE.Mesh(plane, mat);
  mesh.position.set(3, 0, 0);

  base.scene.add(mesh);
  //给平面设置第二组uv
  plane.setAttribute(
    "uv",
    new THREE.BufferAttribute(plane.attributes.uv.array, 2)
  );
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(10);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

function update() {
  base.update();
  controls.update();
  requestAnimationFrame(update);
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
