<!-- 
    btStaticPlaneShape:ax+by+cz+d=0//平面公式
 -->
<script setup>
import Base from "../Base";
import { onMounted, onUpdated, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
let canvasDom = ref(null);
let base, controls, gui;
onMounted(() => {
  gui = new GUI();
  base = new Base(canvasDom.value);
  base.addAmbientLight(0.5);
  let light = base.addDirLight();
  light.position.set(-7, 10, 15);
  light.castShadow = true;
  const d = 10;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 2;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  light.shadow.bias = -0.003;
  base.camera.position.set(0, 30, 40);
  window.addEventListener("resize", resize);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  // createAmmo()
  Ammo().then(function (AmmoLib) {
    console.log(AmmoLib);
    Ammo = AmmoLib;
    initPhysics();
    // createBrick()
    // createPlane()
    createCloth();
    // createObject(10,10,10,0,100,0,1)
    // createObject(10,10,10,4,150,0,1)
    // createObject(10,10,10,9.8,170,0,1)
    // createObject(1000,10,1000,0,0,0,0)
  });
  update();
});
let collisionConfiguration = null;
let dispatcher = null;
let broadphase = null;
let solver = null,
  softsolver = null;
let physicsWorld = null;
let transformAux1, tempBtVec3_1;
let boxmesh, btbox, body;
let body1, mesh1;
let hinge;
function func_clickbtn() {
  let { mesh, body } = createObject(10, 10, 10, 0, 20, 30, 1);
  body1 = body;
  mesh1 = mesh;
  //    body.setLinearVelocity(new Ammo.
  //    btVector3(0, 10, 0));
  body1.applyCentralForce(new Ammo.btVector3(0, 0, 100));
}
function createPlane() {
  createObject(
    1000,
    5,
    1000,
    0,
    -3.5,
    0,
    0,
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
}
//创建砖块
function createBrick() {
  for (let i = -5; i <= 5; i++) {
    for (let j = 0; j < 10; j++) {
      createObject(
        2,
        1,
        1.5,
        i * 2,
        j,
        0,
        1,
        new THREE.MeshPhongMaterial({
          color: Math.floor(Math.random() * (1 << 24)),
        })
      );
    }
  }
}
//创建布料
function createCloth() {
  //竖向
  let { body: body1 } = createObject(1, 10, 1, 0, 5, 0, 0);

  let { body: body2 } = createObject(10, 1, 1, 5, 10, 0, 3);

  // Hinge constraint to move the arm
  //铰链约束以移动手臂
  const pivotA = new //0,3,0
  Ammo.btVector3(0, 5, 0);
  const pivotB = new //0,-0.2,-3.5
  Ammo.btVector3(-5, 0, 0);
  const axis = new Ammo.btVector3(0, 1, 0);
  hinge = new //铰链关节
  Ammo.btHingeConstraint(
    body1,
    body2,
    //相对坐标
    pivotA,
    pivotB,
    axis,
    axis,
    true
  );

  //添加约束
  /**
			 * 该函数用于将一个约束加入物理世界中。

参数说明：

- constraint：要添加的约束对象。
- disableCollisionsBetweenLinkedBodies：默认为false，
表示约束连接的两个物体之间可以发生碰撞。若设为true，
则表示连接的物体间不会发生碰撞。
			*/
  physicsWorld.addConstraint(hinge, true);
}
//初始化物理世界
function initPhysics() {
  //允许配置Bullet碰撞检测堆栈分配器、池内存分配器
  //软体
  collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
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
  softsolver = new Ammo.btDefaultSoftBodySolver();

  physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
    //碰撞对算法的分发器
    dispatcher,
    //宽相，快速检测碰撞
    broadphase,
    //约束
    solver,
    //碰撞配置
    collisionConfiguration,
    softsolver
  );
  //设置重力
  physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

  //btTransform类支持仅具有平移和旋转而没有缩放/剪切的刚性变换
  transformAux1 = new Ammo.btTransform();
  tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
}
let objs = [];
//创建出Three.js中的物体，并且创建出Ammo中的物体
//宽度，高度，深度，x,y,z的位置
function createObject(
  width,
  height,
  depth,
  x,
  y,
  z,
  mass,
  mat = new THREE.MeshPhongMaterial({ color: 0xdd99aa })
) {
  let box = new THREE.BoxGeometry(width, height, depth);
  // let mat=new THREE.MeshStandardMaterial()
  let mesh = new THREE.Mesh(box, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  base.scene.add(mesh);

  let boxshape = new Ammo.btBoxShape(
    new Ammo.btVector3(width / 2, height / 2, depth / 2)
  );
  boxshape.setMargin(0.5);
  let transform = new Ammo.btTransform();
  transform.setIdentity(); //设置为单位矩阵，相当于初始化
  //设置原点
  transform.setOrigin(new Ammo.btVector3(x, y, z));
  let motionState = new Ammo.btDefaultMotionState(transform);
  const localInertia = new Ammo.btVector3(0, 0, 0);
  boxshape.calculateLocalInertia(mass, localInertia);
  // const rbInfo = new Ammo.
  // 	btRigidBodyConstructionInfo(mass, motionState,
  // 		physicsShape, localInertia);
  let rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    boxshape,
    localInertia
  );
  //刚体
  let body = new Ammo.btRigidBody(rbInfo);
  body.setActivationState(4);
  // body.setRestitution(0.5)
  // body.setFriction(0.1);
  // body.setActivationState(1);
  // const localInertia = new Ammo.btVector3(0, 0, 0);
  // 			physicsShape.
  // 				calculateLocalInertia(mass, localInertia);

  // 			const rbInfo = new Ammo.
  // 				btRigidBodyConstructionInfo(mass, motionState,
  // 					physicsShape, localInertia);
  // 			const body = new Ammo.btRigidBody(rbInfo);
  // body.
  //     applyCentralForce(new Ammo.btVector3(100,0,0))
  // body.setMargin(0.5)
  physicsWorld.addRigidBody(body);
  mesh.userData.physicsBody = body;

  let obj = {
    mesh,
    body,
  };
  objs.push(obj);
  return { mesh, body };
}
let clock = new THREE.Clock();
function update() {
  requestAnimationFrame(update);
  base.update();
  controls.update();
  hinge?.enableAngularMotor(true, 0.8, 50);

  // Step world
  physicsWorld.stepSimulation(clock.getDelta(), 10);
  if (objs.length > 0) {
    for (let i = 0; i < objs.length; i++) {
      let mesh = objs[i].mesh;
      let body = mesh.userData.physicsBody;
      let ms = body.getMotionState();
      ms?.getWorldTransform(transformAux1);
      let p = transformAux1.getOrigin();
      let r = transformAux1.getRotation();
      mesh.position.set(p.x(), p.y(), p.z());
      mesh.quaternion.set(r.x(), r.y(), r.z(), r.w());
    }
  }
}
function resize() {
  base.resize();
}
</script>

<template>
  <button @click="func_clickbtn" class="button-dom">按钮</button>
  <canvas ref="canvasDom" class="canvasDom"></canvas>
</template>

<style scoped>
.canvasDom {
  width: 100vw;
  height: 100vh;
}
.button-dom {
  position: absolute;
  right: 0;
  top: 150px;
}
</style>
