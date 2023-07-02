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

let base, controls;
let collisionConfiguration = null;
let physicsworld, dispatcher, broadphase, solver;
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-10, 10, 10);
  dirLight.lookAt(0, 0, 0);

  Ammo().then((AmmoLib) => {
    console.log(AmmoLib);
    Ammo = AmmoLib;
    initPhysics();
    update();
  });
  window.addEventListener("resize", resize);
});

//初始化物理世界
function initPhysics() {
  //离散动态世界
  //允许配置Bullet碰撞检测堆栈分配器、池内存分配器
  collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  //算法的分发器
  //支持处理 ConvexConvex 和 ConvexConvex 碰撞对的算法。
  // 撞击时间、最近点和穿透深度。
  dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  //在物理引擎中，宽相是一种用于快速确定哪些物体可能
  //相交的碰撞检测方法。
  //宽相技术可以将整个物理世界分为多个部分，
  //每个部分包含着一些物体。在碰撞检测过程中，
  //只需要搜索那些可能相交的物体，而不是搜索所有的物体，
  //从而提高了碰撞检测的效率
  broadphase = new Ammo.btDbvtBroadphase();
  /**
   * 在 Ammo 引擎中，
   * 约束（constraint）
   * 是指在物理仿真中用来限制物体运动的规则或条件。
   * 它们可以用来模拟轮子与地面的接触、关节或弹簧的连接、
   * 车辆的悬架系统等等。
   * 约束可以强制物体之间具有特定的相对位置、
   * 速度和加速度，以及一些额外的限制条件，
   * 如最大扭矩和最大力的限制。在 Ammo 引擎中，
   * 约束可以通过各种类来实现，如点到点约束、
   * 震荡器约束、固定连接约束等等。
   */
  solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration
  );
  //设置重力
  physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
}

//宽度，高度，深度，位置，旋转，材质
function createObject(width, height, depth, pos, quat, mat = createMaterial()) {
  //创建threejs当中的物体
  let box = new THREE.BoxGeometry(width, height, depth);
  let mesh = new THREE.Mesh(box, mat);
  mesh.getWorldPosition.copy(pos); //位置
  mesh.quaternion.copy(quat); //旋转
  base.scene.add(mesh);
  //创建物理引擎中的形状
  let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2));
  //它里面包含了物体的旋转和平移信息
  let transform = new Ammo.btTransform();
  transform.setIdentity(); //设置为单位矩阵，便于初始化
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
}

function createMaterial() {
  // 1<<24   1*2^24
  //0xffffff  16^6
  //随机颜色
  console.log("---");
  return THREE.MeshStandardMaterial({ color: Math.random() * (1 << 24) });
}

function update() {
  requestAnimationFrame(update);
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
