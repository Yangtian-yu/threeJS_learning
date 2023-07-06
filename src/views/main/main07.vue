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
  base.addAmbientLight(0.5);
  let dirLight = base.addDirLight(0.5);
  dirLight.position.set(10, 10, 10);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 3);
  addTexture();
  createAxesHelper();
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
    map: doorColorTexture, //颜色贴图
    alphaMap: doorAplhaTexture, //灰度纹理，用于控制整个表面的不透明度
    transparent: true, //是否透明
    aoMap: doorAmbientTexture, //环境遮挡贴图
    aoMapIntensity: 1, //环境遮挡效果的强度
    displacementMap: doorHeightTexture, //位移贴图会影响网格顶点的位置
    displacementScale: 0.1, //位移贴图对网格的影响程度
    side: THREE.DoubleSide, //双面
    roughness: 1, //材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射
    roughnessMap: roughessTexture, //该纹理的绿色通道用于改变材质的粗糙度。
    metalness: 1, //材质与金属的相似度 如木材或石材，使用0.0，金属使用1.0，通常没有中间值
    metalnessMap: metalnessTexture, //该纹理的蓝色通道用于改变材质的金属度。
    normalMap: normalTexture, //用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。
    //法线贴图不会改变曲面的实际形状，只会改变光照
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
