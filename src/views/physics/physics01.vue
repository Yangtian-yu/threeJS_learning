<template>
  <div class="contariner">
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入connon引擎
import * as CANNON from "cannon-es";
let base, controls, hitSound;
const cubeArr = [];
const canvasDom = ref(null);
let world;
//设置物体材质
const cubeWorldMaterial = new CANNON.Material("cube");
onMounted(() => {
  base = new Base(canvasDom.value);
  base.addAmbientLight(0.5);
  base.addDirLight(0.5);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.camera.position.set(0, 0, 10);
  // 添加坐标轴辅助器
  const axesHelper = new THREE.AxesHelper(5);
  base.scene.add(axesHelper);
  createPlane();
  createPhyics();
  update();
  window.addEventListener("resize", resize);
});

window.addEventListener("click", createCube);

function createPhyics() {
  world = new CANNON.World();
  world.gravity.set(0, -9.8, 0);
  // 创建击打声音
  hitSound = new Audio("matter/textures/metalHit.mp3");
  // 物理世界创建地面
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body();
  const floorMaterial = new CANNON.Material("floor");
  floorBody.material = floorMaterial;
  // 当质量为0的时候，可以使得物体保持不动
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  // 地面位置
  floorBody.position.set(0, -5, 0);
  // 旋转地面的位置
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(floorBody);
  // 设置2种材质碰撞的参数
  const defaultContactMaterial = new CANNON.ContactMaterial(
    cubeWorldMaterial,
    floorMaterial,
    {
      //   摩擦力
      friction: 0.1,
      // 弹性
      restitution: 0.7,
    }
  );

  // 讲材料的关联设置添加的物理世界
  world.addContactMaterial(defaultContactMaterial);

  // 设置世界碰撞的默认材料，如果材料没有设置，都用这个
  world.defaultContactMaterial = defaultContactMaterial;
}

function createCube() {
  // 创建立方体和平面
  const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial();
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  base.scene.add(cube);
  // 创建物理cube形状
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

  // 创建物理世界的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    //   小球质量
    mass: 1,
    //   物体材质
    material: cubeWorldMaterial,
  });
  cubeBody.applyLocalForce(
    new CANNON.Vec3(300, 0, 0), //添加的力的大小和方向
    new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
  );

  // 将物体添加至物理世界
  world.addBody(cubeBody);
  // 添加监听碰撞事件
  function HitEvent(e) {
    // 获取碰撞的强度
    //   console.log("hit", e);
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    console.log(impactStrength);
    if (impactStrength > 2) {
      //   重新从零开始播放
      hitSound.currentTime = 0;
      hitSound.volume = impactStrength / 12;
      hitSound.play();
    }
  }
  cubeBody.addEventListener("collide", HitEvent);
  cubeArr.push({
    mesh: cube,
    body: cubeBody,
  });
}

const createPlane = () => {
  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200),
    new THREE.MeshStandardMaterial()
  );
  floor.position.set(0, -5, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  base.scene.add(floor);
};

function resize() {
  base.resize();
}

// 设置时钟
const clock = new THREE.Clock();

function update() {
  let deltaTime = clock.getDelta();
  // 更新物理引擎里世界的物体
  world.step(1 / 120, deltaTime);
  //   cube.position.copy(cubeBody.position);
  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position);
    // 设置渲染的物体跟随物理的物体旋转
    item.mesh.quaternion.copy(item.body.quaternion);
  });
  requestAnimationFrame(update);
  base.update();
  controls.update();
}
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
.contariner {
  width: 100%;
  height: 100%;
  background-color: rgb(36, 58, 66);
}
</style>
