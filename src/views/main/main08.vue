<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
let base, controls;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  base.addAmbientLight(0.5);
  let dirLight = base.addDirLight(0.5);
  dirLight.position.set(10, 10, 10);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 3);
  // addTexture();
  addShapeEnvironmentMap();
  createAxesHelper();
  addrbgEnvironmentMap();
  update();
  window.addEventListener("resize", resize);
});

const addTexture = () => {
  let event = {};
  //单张纹理图的加载
  event.onLoad = () => {
    console.log("图片加载完成");
  };
  event.onProgress = (url, num, total) => {
    console.log("图片加载完成", url);
    console.log("图片加载进度", num);
    console.log("图片总数", total);
    console.log("加载进度的百分比：", ((num / total) * 100).toFixed(2));
  };
  event.onError = (e) => {
    console.log(e);
    console.log("图片加载出错");
  };

  //设置加载管理器
  const loadingManager = new THREE.LoadingManager(
    event.onLoad,
    event.onProgress,
    event.onError
  );
  //导入纹理
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const doorColorTexture = textureLoader.load("matter/textures/door/color.jpg");
  const doorAplhaTexture = textureLoader.load("matter/textures/door/alpha.jpg");
  const doorAmbientTexture = textureLoader.load(
    "matter/textures/door/ambientOcclusion.jpg"
  );

  //导入置换贴图
  const doorHeightTexture = textureLoader.load(
    "matter/textures/door/height.jpg",
    event.onLoad,
    event.onProgress,
    event.onError
  );

  //导入粗糙度贴图
  const roughessTexture = textureLoader.load(
    "matter/textures/door/roughness.jpg"
  );

  //导入金属贴图
  const metalnessTexture = textureLoader.load(
    "matter/textures/door/metalness.jpg"
  );

  //导入法线贴图
  const normalTexture = textureLoader.load("matter/textures/door/normal.jpg");
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
  const mat = new THREE.MeshStandardMaterial({
    color: "#ffff00",
    map: doorColorTexture,
    alphaMap: doorAplhaTexture,
    transparent: true,
    aoMap: doorAmbientTexture,
    aoMapIntensity: 1,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    side: THREE.DoubleSide,
    roughness: 1,
    roughnessMap: roughessTexture,
    metalness: 1,
    metalnessMap: metalnessTexture,
    normalMap: normalTexture,
  });
  const mesh = new THREE.Mesh(geo, mat);
  base.scene.add(mesh);
  //mesh设置第二组uv
  geo.setAttribute(
    "uv2",
    new THREE.BufferAttribute(geo.attributes.uv.array, 2)
  );

  //平面对比
  createPlane(mat);
};

//加载hdr环境图
const addrbgEnvironmentMap = () => {
  const rgbLoader = new RGBELoader();
  rgbLoader.loadAsync("matter/textures/hdr/012.hdr").then((texture) => {
    //设置环境纹理贴图的映射模式为等距圆柱投影的环境贴图，也被叫做经纬线映射贴图
    texture.mapping = THREE.EquirectangularReflectionMapping;
    base.scene.background = texture;
    //所有物体默认反射的背景图
    base.scene.environment = texture;
  });
};

//物理添加环境贴图
const addShapeEnvironmentMap = () => {
  //设置cube纹理加载器
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envMapTexture = cubeTextureLoader.load([
    "matter/textures/environmentMaps/1/px.jpg",
    "matter/textures/environmentMaps/1/nx.jpg",
    "matter/textures/environmentMaps/1/py.jpg",
    "matter/textures/environmentMaps/1/ny.jpg",
    "matter/textures/environmentMaps/1/pz.jpg",
    "matter/textures/environmentMaps/1/nz.jpg",
  ]);

  const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
  const mat = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.1,
    // envMap: envMapTexture, //环境贴图
  });
  const shpere = new THREE.Mesh(sphereGeometry, mat);
  base.scene.add(shpere);
  //场景添加环境贴图
  base.scene.background = envMapTexture;
  //所有物体默认反射的背景图
  base.scene.environment = envMapTexture;
};

const createPlane = (mat) => {
  const plane = new THREE.PlaneBufferGeometry(1, 1, 200, 200);
  const mesh = new THREE.Mesh(plane, mat);
  mesh.position.set(1.5, 0, 0);
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
