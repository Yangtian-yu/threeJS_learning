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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
let base, controls, mixer;
let textureload = new THREE.TextureLoader();
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);
  base.camera.position.z = 10;
  update();
  createBox();
  window.addEventListener("resize", resize);
});

const clock = new THREE.Clock();

function resize() {
  base.resize();
}
function createBox() {
  //存放的是一些位置信息（不是实体）
  let box = new THREE.BoxGeometry(1, 1, 1);
  let mat = new THREE.MeshBasicMaterial({
    // color: 0xff0000, transparent: true
    map: textureload.load("1.jpg"),
  });
  let mesh = new THREE.Mesh(box, mat);
  // base.scene.add(mesh);

  //存放的是一些位置信息（不是实体）
  let box1 = new THREE.BoxGeometry(1, 1, 1);
  let mat1 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
  });
  let mesh1 = new THREE.Mesh(box1, mat1);
  mesh1.position.x = 5;
  // base.scene.add(mesh1);

  const group = new THREE.AnimationObjectGroup();
  group.add(mesh);
  group.add(mesh1);
  // 一秒可见  2秒不可见  3秒可见
  // const booleanTrack = new THREE.BooleanKeyframeTrack(
  //   ".visible",
  //   [0, 1, 2],
  //   [true, false, true]
  // );
  const colortrack = new THREE.ColorKeyframeTrack(
    ".material.color",
    [0, 1, 2],
    [1, 0, 0, 0, 1, 0, 1, 0, 0]
  );

  const numbertrack = new THREE.NumberKeyframeTrack(
    ".material.opacity",
    [0, 1, 2],
    [1, 0, 1]
  );
  // setFromAxisAngle:根据那个轴线，旋转角度
  let start = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    0
  );
  let end = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    Math.PI
  );
  const quatertrack = new THREE.QuaternionKeyframeTrack(
    ".quaternion",
    [0, 1, 2],
    [
      start.x,
      start.y,
      start.z,
      start.w,
      end.x,
      end.y,
      end.z,
      end.w,
      start.x,
      start.y,
      start.z,
      start.w,
    ]
  );
  // 0秒位置 （0,0,0，） 一秒位置（10,0,0） 两秒位置（0,0,0）
  const transForms = new THREE.VectorKeyframeTrack(
    ".position",
    [0, 1, 2],
    [0, 0, 0, 10, 0, 0, 0, 0, 0]
  );

  const scale = new THREE.VectorKeyframeTrack(
    ".scale",
    [0, 1, 2],
    [1, 1, 1, 2, 2, 2, 1, 1, 1]
  );

  const stringtrack = new THREE.StringKeyframeTrack(
    ".material.map",
    [0, 1, 2],
    [
      textureload.load("1.jpg"),
      textureload.load("2.jpg"),
      textureload.load("1.jpg"),
    ]
  );

  const clip = new THREE.AnimationClip("boxAnim", -1, [
    // colortrack,
    // numbertrack,
    // quatertrack,
    // transForms,
    // scale,
    stringtrack,
  ]);

  new GLTFLoader().load("box.glb", (obj) => {
    console.log(obj);
    base.scene.add(obj.scene);
    //如果模型自己有动画
    //播放
    let clip = obj.animations[0];
    console.log(clip);
    if (clip) {
      mixer = new THREE.AnimationMixer(obj.scene.children[0]);
      let anim = mixer.clipAction(clip);
      anim.play();
    }
  });
}

function update() {
  requestAnimationFrame(update);
  base.update();
  controls.update();
  mixer?.update(clock.getDelta());
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
