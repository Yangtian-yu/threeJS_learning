<script setup>
import Base from "../Base";
import { onMounted, onUpdated, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let canvasDom = ref(null);
let base, controls;
let cloth;
let textureLoader = new THREE.TextureLoader();
onMounted(() => {
  base = new Base(canvasDom.value);
  initInput();
  base.addAmbientLight(0.45);
  let light = base.addDirLight(0.5);
  light.position.set(7, 10, 15);
  light.castShadow = true;
  const d = 10;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;
  light.shadow.bias = -0.003;
  base.camera.position.set(0, 27, 35);
  window.addEventListener("resize", resize);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  Ammo().then(function (AmmoLib) {
    Ammo = AmmoLib;
    initPhysics();
    createBrick();
    createPlane();
    createObjects();
    update();
  });
});
let collisionConfiguration = null;
let dispatcher = null;
let broadphase = null;
let solver = null,
  softsolver = null;
let physicsWorld = null;
let transformAux1;
let body1;
let hinge;
// let brickCount = 10;
function func_clickbtn() {
  let { mesh, body } = createObject(10, 10, 10, 0, 20, 30, 1);
  body1 = body;
  mesh1 = mesh;
  body1.applyCentralForce(new Ammo.btVector3(0, 0, 100));
}
// let textureLoader = new THREE.TextureLoader();
function createPlane() {
  let plane = createObject(
    100,
    1,
    100,
    0,
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Quaternion(),
    new THREE.MeshLambertMaterial()
  );
  textureLoader.load("textures/grid.png", function (texture) {
    // texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40, 40);
    plane.material.map = texture;
    plane.material.needsUpdate = true; //重新编译材质
  });
}
//创建砖块
function createBrick() {
  for (let i = -5; i <= 5; i++) {
    for (let j = 0; j <= 10; j++) {
      createObject(
        1.5,
        1,
        1.5,
        1,
        new THREE.Vector3(i * 1.5, j + 0.5, -5),
        new THREE.Quaternion()
      );
    }
  }
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
  //   tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
}

let rigidBodies = [];
function createObjects() {
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  const clothWidth = 8;
  const clothHeight = 5;
  const clothNumSegmentsX = clothWidth * 5;
  const clothNumSegmentsY = clothHeight * 5;
  const clothPos = new THREE.Vector3(5, 9.5, 0);

  // The base
  let armMass = 2;
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x606060,
  });
  quat.set(0, 0, 0, 1);
  pos.set(-9, 6, 0);
  const pylon = createObject(1, 12, 1, 0, pos, quat, baseMaterial);
  pylon.castShadow = true;
  pylon.receiveShadow = true;
  pos.set(0, 12, 0);
  const arm = createObject(18, 1, 1, armMass, pos, quat, baseMaterial);
  arm.castShadow = true;
  arm.receiveShadow = true;

  // Hinge constraint to move the arm
  const pivotA = new Ammo.btVector3(0, 6, 0);
  const pivotB = new Ammo.btVector3(-9, 0, 0);
  const axis = new Ammo.btVector3(0, 1, 0);
  hinge = new Ammo.btHingeConstraint(
    pylon.userData.physicsBody,
    arm.userData.physicsBody,
    pivotA,
    pivotB,
    axis,
    axis,
    true
  );
  physicsWorld.addConstraint(hinge, true);

  const clothGeometry = new THREE.PlaneGeometry(
    clothWidth,
    clothHeight,
    clothNumSegmentsX,
    clothNumSegmentsY
  );
  clothGeometry.translate(clothPos.x, clothPos.y, clothPos.z);

  const clothMaterial = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  cloth = new THREE.Mesh(clothGeometry, clothMaterial);
  cloth.castShadow = true;
  cloth.receiveShadow = true;
  base.scene.add(cloth);
  textureLoader.load("textures/grid.png", function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(clothNumSegmentsX, clothNumSegmentsY);
    cloth.material.map = texture;
    cloth.material.needsUpdate = true;
  });

  const softBodyHelpers = new Ammo.btSoftBodyHelpers();
  //左上角
  const clothCorner00 = new Ammo.btVector3(
    clothPos.x - clothWidth / 2,
    clothPos.y + clothHeight / 2,
    clothPos.z
  );
  //右上角
  const clothCorner01 = new Ammo.btVector3(
    clothPos.x + clothWidth / 2,
    clothPos.y + clothHeight / 2,
    clothPos.z
  );
  //左下角
  const clothCorner10 = new Ammo.btVector3(
    clothPos.x - clothWidth / 2,
    clothPos.y - clothHeight / 2,
    clothPos.z
  );
  //右下角
  const clothCorner11 = new Ammo.btVector3(
    clothPos.x + clothWidth / 2,
    clothPos.y - clothHeight / 2,
    clothPos.z
  );
  console.log(physicsWorld);
  const clothSoftBody = softBodyHelpers.CreatePatch(
    physicsWorld.getWorldInfo(),
    clothCorner00,
    clothCorner01,
    clothCorner10,
    clothCorner11,
    clothNumSegmentsX + 1,
    clothNumSegmentsY + 1,
    0,
    true
  );
  const sbConfig = clothSoftBody.get_m_cfg();
  sbConfig.set_viterations(10);
  sbConfig.set_piterations(10);

  clothSoftBody.setTotalMass(10, false);

  physicsWorld.addSoftBody(clothSoftBody, 1, -1);
  cloth.userData.physicsBody = clothSoftBody;

  const influence = 0.5;
  clothSoftBody.appendAnchor(0, arm.userData.physicsBody, false, influence);
  clothSoftBody.appendAnchor(
    clothNumSegmentsX,
    arm.userData.physicsBody,
    false,
    influence
  );

  // update();
}

function createObject(
  width,
  height,
  depth,
  mass,
  pos,
  quat,
  mat = new THREE.MeshLambertMaterial({
    color: Math.floor(Math.random() * (1 << 24)),
  })
) {
  let box = new THREE.BoxGeometry(width, height, depth);
  let threeObject = new THREE.Mesh(box, mat);
  threeObject.castShadow = true;
  threeObject.receiveShadow = true;
  threeObject.position.copy(pos);
  threeObject.quaternion.copy(quat);
  base.scene.add(threeObject);

  let boxshape = new Ammo.btBoxShape(
    new Ammo.btVector3(width / 2, height / 2, depth / 2)
  );
  let transform = new Ammo.btTransform();
  transform.setIdentity(); //设置为单位矩阵，相当于初始化
  //设置原点
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);
  const localInertia = new Ammo.btVector3(0, 0, 0);
  boxshape.calculateLocalInertia(mass, localInertia);
  let rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    boxshape,
    localInertia
  );
  //刚体
  let body = new Ammo.btRigidBody(rbInfo);
  if (mass > 0) {
    rigidBodies.push(threeObject);
  }
  threeObject.userData.physicsBody = body;
  physicsWorld.addRigidBody(body);
  return threeObject;
}

let armMovement = 0;
function initInput() {
  window.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
      // Q
      case 81:
        armMovement = 1;
        break;

      // A
      case 65:
        armMovement = -1;
        break;
    }
  });

  window.addEventListener("keyup", function () {
    armMovement = 0;
  });
}

let clock = new THREE.Clock();
function update() {
  requestAnimationFrame(update);
  base.update();
  controls.update();
  hinge?.enableAngularMotor(true, 0.7 * armMovement, 50);

  // Step world
  let d = clock.getDelta();
  physicsWorld.stepSimulation(d);
  let softbody;
  let clothPositions;
  let numVerts;
  softbody = cloth.userData.physicsBody;
  clothPositions = cloth.geometry.attributes.position.array;
  numVerts = clothPositions.length / 3;
  let nodes = softbody.get_m_nodes(); //得到所有节点
  let indexFloat = 0;
  for (let i = 0; i < numVerts; i++) {
    let node = nodes.at(i);
    //获取刚体位置
    let nodePos = node.get_m_x();
    clothPositions[indexFloat++] = nodePos.x();
    clothPositions[indexFloat++] = nodePos.y();
    clothPositions[indexFloat++] = nodePos.z();
  }
  cloth.geometry.computeVertexNormals();
  cloth.geometry.attributes.position.needsUpdate = true;
  cloth.geometry.attributes.normal.needsUpdate = true;
  // console.log(cloth.geometry);
  //  }

  if (rigidBodies.length > 0) {
    for (let i = 0; i < rigidBodies.length; i++) {
      let mesh = rigidBodies[i];
      let body = mesh.userData.physicsBody;
      let ms = body.getMotionState();
      ms.getWorldTransform(transformAux1);
      //  console.log(transformAux1)
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
  <!-- <button @click="func_clickbtn">按钮</button> -->
  <canvas ref="canvasDom" class="canvasDom"></canvas>
</template>

<style scoped>
.canvasDom {
  width: 100vw;
  height: 100vh;
}
</style>
