<template>
  <canvas ref="canvasDom" class="canvasDom"></canvas>
</template>

<script setup>
import Base from "../Base";
import { onMounted, onUpdated, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
let canvasDom = ref(null);
let base, controls, gui;
let body2;
onMounted(() => {
  gui = new GUI();
  base = new Base(canvasDom.value);
  let light = base.addDirLight();
  light.position.set(-100, 100, 0);
  light.castShadow = true;
  const d = 140;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 20;
  light.shadow.camera.far = 500;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;
  base.camera.position.set(0, 300, 400);
  window.addEventListener("resize", resize);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  // createAmmo()

  Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;

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
      //碰撞对算法的分发器
      dispatcher,
      //宽相，快速检测碰撞
      broadphase,
      //约束
      solver,
      //碰撞配置
      collisionConfiguration
    );
    //设置重力
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

    //btTransform类支持仅具有平移和旋转而没有缩放/剪切的刚性变换
    transformAux1 = new Ammo.btTransform();
    tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);

    //创建一个plane
    let plane = new THREE.BoxGeometry(1000, 10, 1000);
    let mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    let planeMesh = new THREE.Mesh(plane, mat);
    // planeMesh.rotateX(-Math.PI/2)
    planeMesh.receiveShadow = true;
    base.scene.add(planeMesh);

    let btbox1 = new Ammo.btBoxShape(new Ammo.btVector3(100, 0.1, 1000));
    const transform1 = new Ammo.btTransform();
    //设置为单位矩阵
    transform1.setIdentity();
    //设置原点
    transform1.setOrigin(new Ammo.btVector3(0, 0, 0));
    //btDefaultMotionState:设置物体的位置，旋转
    const motionState1 = new Ammo.btDefaultMotionState(transform1);
    const rbInfo1 = new Ammo.btRigidBodyConstructionInfo(
      0,
      motionState1,
      btbox1,
      new Ammo.btVector3(0, 0, 0)
    );
    let body1 = new Ammo.btRigidBody(rbInfo1);

    // body.setFriction(0.5);
    physicsWorld.addRigidBody(body1);

    let box = new THREE.BoxGeometry(10, 10, 10);
    let mat1 = new THREE.MeshStandardMaterial();
    boxmesh = new THREE.Mesh(box, mat1);
    boxmesh.position.set(0, 100, 0);
    boxmesh.castShadow = true;
    boxmesh.receiveShadow = true;
    base.scene.add(boxmesh);
    btbox = new Ammo.btBoxShape(new Ammo.btVector3(10 / 2, 10 / 2, 10 / 2));
    const transform = new Ammo.btTransform();
    //设置为单位矩阵
    transform.setIdentity();
    //设置原点
    transform.setOrigin(new Ammo.btVector3(0, 100, 0));
    //btDefaultMotionState:设置物体的位置，旋转
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(1, motionState, btbox);
    body2 = new Ammo.btRigidBody(rbInfo);
    body2.setRestitution(0.5);
    // body.setFriction(0.5);
    physicsWorld.addRigidBody(body2);
  });
  update();
});
let collisionConfiguration = null;
let dispatcher = null;
let broadphase = null;
let solver = null;
let physicsWorld = null;
let transformAux1, tempBtVec3_1;
let boxmesh, btbox, body;
function createAmmo() {
  let box = new THREE.BoxGeometry(10, 10, 10);
  let mat = new THREE.MeshStandardMaterial();
  boxmesh = new THREE.Mesh(box, mat);
  boxmesh.position.y = 100;
  boxmesh.castShadow = true;
  boxmesh.receiveShadow = true;
  base.scene.add(boxmesh);
  Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    // console.log(Ammo)
    //允许配置Bullet碰撞检测堆栈分配器、池内存分配器
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    //算法的分发器
    //支持处理 ConvexConvex 和 ConvexConvex 碰撞对的算法。
    // 撞击时间、最近点和穿透深度。
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    // 在物理引擎中，宽相是一种用于快速确定哪些物体可能
    //相交的碰撞检测方法。
    //宽相技术可以将整个物理世界分为多个部分，
    //每个部分包含着一些物体。在碰撞检测过程中，
    //只需要搜索那些可能相交的物体，而不是搜索所有的物体，
    //从而提高了碰撞检测的效率
    broadphase = new Ammo.btDbvtBroadphase();

    /**
     * 在 Ammo 引擎中，约束（constraint）是指在物理仿真中用来限制物体运动的规则或条件。它们可以用来模拟轮子与地面的接触、关节或弹簧的连接、车辆的悬架系统等等。约束可以强制物体之间具有特定的相对位置、速度和加速度，以及一些额外的限制条件，如最大扭矩和最大力的限制。在 Ammo 引擎中，约束可以通过各种类来实现，如点到点约束、震荡器约束、固定连接约束等等。
     */
    solver = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      //碰撞对算法的分发器
      dispatcher,
      //宽相，快速检测碰撞
      broadphase,
      //约束
      solver,
      //碰撞配置
      collisionConfiguration
    );
    //设置重力
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

    //btTransform类支持仅具有平移和旋转而没有缩放/剪切的刚性变换
    transformAux1 = new Ammo.btTransform();
    tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);

    btbox = new Ammo.btBoxShape(new Ammo.btVector3(5, 5, 5));
    const transform = new Ammo.btTransform();
    //设置为单位矩阵
    transform.setIdentity();
    //设置原点
    transform.setOrigin(new Ammo.btVector3(0, 100, 0));
    //btDefaultMotionState:设置物体的位置，旋转
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      1,
      motionState,
      btbox,
      new Ammo.btVector3(0, 0, 0)
    );
    body = new Ammo.btRigidBody(rbInfo);

    // body.setFriction(0.5);
    physicsWorld.addRigidBody(body);

    //创建一个plane
    let plane = new THREE.BoxGeometry(1000, 10, 1000);
    let mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    let planeMesh = new THREE.Mesh(plane, mat);
    // planeMesh.rotateX(-Math.PI/2)
    planeMesh.receiveShadow = true;
    base.scene.add(planeMesh);

    let btbox1 = new Ammo.btBoxShape(new Ammo.btVector3(100, 0.1, 1000));
    const transform1 = new Ammo.btTransform();
    //设置为单位矩阵
    transform1.setIdentity();
    //设置原点
    transform1.setOrigin(new Ammo.btVector3(0, 0, 0));
    //btDefaultMotionState:设置物体的位置，旋转
    const motionState1 = new Ammo.btDefaultMotionState(transform1);
    const rbInfo1 = new Ammo.btRigidBodyConstructionInfo(
      0,
      motionState1,
      btbox1,
      new Ammo.btVector3(0, 0, 0)
    );
    let body1 = new Ammo.btRigidBody(rbInfo1);

    // body.setFriction(0.5);
    physicsWorld.addRigidBody(body1);
  });
}
let clock = new THREE.Clock();
function update() {
  requestAnimationFrame(update);
  base.update();
  controls.update();
  physicsWorld?.stepSimulation(clock.getDelta(), 10);
  if (body2) {
    let ms = body2.getMotionState();
    body2.applyCentralForce(new Ammo.btVector3(10, -200, 0));
    // body2.getLinearVelocity(new Ammo.btVector3(0,-100,0))
    ms.getWorldTransform(transformAux1);
    const p = transformAux1.getOrigin();
    boxmesh.position.x = p.x();
    boxmesh.position.y = p.y();
    boxmesh.position.z = p.z();
  }
}
function resize() {
  base.resize();
}
</script>

<style scoped>
.canvasDom {
  width: 100vw;
  height: 100vh;
}
</style>
