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
let cloth;
let textureLoader = new THREE.TextureLoader();
onMounted(() => {
  gui = new GUI();
  base = new Base(canvasDom.value);
  initInput();
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
    Ammo = AmmoLib;
    initPhysics();
    // createBrick()
    // createPlane()
    //  createCloth()
    createObjects();
    // createObject(10,10,10,0,100,0,1)
    // createObject(10,10,10,4,150,0,1)
    // createObject(10,10,10,9.8,170,0,1)
    // createObject(1000,10,1000,0,0,0,0)
  });
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
  let clothwidth = 5;
  let clothheight = 3;
  let clothsegwidth = clothwidth * 5;
  let clothsegheight = clothheight * 5;
  //创建布料
  let geo = new THREE.PlaneGeometry(
    clothwidth,
    clothheight,
    clothsegwidth,
    clothsegheight
  );
  let mat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });
  cloth = new THREE.Mesh(geo, mat);
  let clothx = 3.5,
    clothy = 4,
    clothz = 0;
  cloth.position.set(clothx, clothy, clothz);
  base.scene.add(cloth);
  //竖向
  let { body: body1 } = createObject(1, 10, 1, 0, 5, 0, 0);

  let { body: body2 } = createObject(10, 1, 1, 5, 10, 0, 1);

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

  //创建软体辅助器
  let softbodyHelpers = new Ammo.btSoftBodyHelpers();
  //左上角
  let cloth00 = new Ammo.btVector3(
    clothx - clothwidth / 2,
    clothy + clothheight / 2,
    clothz
  );
  //右上角
  let cloth01 = new Ammo.btVector3(
    clothx + clothwidth / 2,
    clothy + clothheight / 2,
    clothz
  );
  //左下角
  let cloth10 = new Ammo.btVector3(
    clothx - clothwidth / 2,
    clothy - clothheight / 2,
    clothz
  );
  //右下角
  let cloth11 = new Ammo.btVector3(
    clothx + clothwidth / 2,
    clothy - clothheight / 2,
    clothz
  );

  let clothSoftBody = softbodyHelpers.CreatePatch(
    physicsWorld.getWorldInfo(),
    cloth00,
    cloth01,
    cloth10,
    cloth11,
    clothsegwidth + 1,
    clothsegheight + 1,
    0,
    true
  );
  //获取配置对象
  let sbConfig = clothSoftBody.get_m_cfg();
  sbConfig.set_piterations(10); //设置位置迭代
  clothSoftBody.setTotalMass(1, false); //设置总质量
  //添加柔软物体
  physicsWorld.addSoftBody(clothSoftBody, 1, -1);
  cloth.userData.physicsBody = clothSoftBody;
  // console.log(cloth,clothSoftBody,cloth.userData.physicsBody)
  let influence = 0.5;
  clothSoftBody.appendAnchor(0, body1, true, influence);
  clothSoftBody.appendAnchor(clothsegwidth, body2, true, influence);
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
  //  boxshape.setMargin(0.5);
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
let rigidBodies = [];
function createObjects() {
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  const clothWidth = 4;
  const clothHeight = 3;
  const clothNumSegmentsZ = clothWidth * 5;
  const clothNumSegmentsY = clothHeight * 5;
  const clothPos = new THREE.Vector3(7.5, 7.5, 0);

  // Ground

  // The base
  const armMass = 2;
  const armLength = 3 + clothWidth;
  const pylonHeight = clothPos.y + clothHeight;
  const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
  pos.set(clothPos.x, 0.1, clothPos.z - armLength);
  quat.set(0, 0, 0, 1);
  pos.set(0, 5, 0);
  const pylon = createParalellepiped(1, 10, 1, 0, pos, quat, baseMaterial);
  pylon.castShadow = true;
  pylon.receiveShadow = true;
  pos.set(5, 10, 0);
  const arm = createParalellepiped(10, 1, 1, armMass, pos, quat, baseMaterial);
  arm.castShadow = true;
  arm.receiveShadow = true;

  // Glue the cloth to the arm

  // Hinge constraint to move the arm
  const pivotA = new Ammo.btVector3(0, 5, 0);
  const pivotB = new Ammo.btVector3(-5, 0, 0);
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
    clothNumSegmentsZ,
    clothNumSegmentsY
  );
  // clothGeometry.rotateY(Math.PI * 0.5);
  clothGeometry.translate(clothPos.x, clothPos.y, clothPos.z);

  const clothMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  cloth = new THREE.Mesh(clothGeometry, clothMaterial);
  cloth.castShadow = true;
  cloth.receiveShadow = true;
  base.scene.add(cloth);
  textureLoader.load("textures/grid.png", function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(clothNumSegmentsZ, clothNumSegmentsY);
    cloth.material.map = texture;
    cloth.material.needsUpdate = true;
  });

  // Cloth physic object
  const softBodyHelpers = new Ammo.btSoftBodyHelpers();
  const clothCorner00 = new Ammo.btVector3(
    clothPos.x,
    clothPos.y + clothHeight / 2,
    clothPos.z
  );
  const clothCorner01 = new Ammo.btVector3(
    clothPos.x + clothWidth / 2,
    clothPos.y + clothHeight / 2,
    clothPos.z
  );
  const clothCorner10 = new Ammo.btVector3(clothPos.x, clothPos.y, clothPos.z);
  const clothCorner11 = new Ammo.btVector3(
    clothPos.x + clothWidth / 2,
    clothPos.y,
    clothPos.z
  );
  const clothSoftBody = softBodyHelpers.CreatePatch(
    physicsWorld.getWorldInfo(),
    clothCorner00,
    clothCorner01,
    clothCorner10,
    clothCorner11,
    clothNumSegmentsZ + 1,
    clothNumSegmentsY + 1,
    0
  );
  const sbConfig = clothSoftBody.get_m_cfg();
  sbConfig.set_viterations(10);
  sbConfig.set_piterations(10);

  clothSoftBody.setTotalMass(0.9, false);

  physicsWorld.addSoftBody(clothSoftBody, 1, -1);
  cloth.userData.physicsBody = clothSoftBody;

  const influence = 0.5;
  clothSoftBody.appendAnchor(0, arm.userData.physicsBody, false, influence);
  clothSoftBody.appendAnchor(
    clothNumSegmentsZ,
    arm.userData.physicsBody,
    false,
    influence
  );

  update();
}

function createParalellepiped(sx, sy, sz, mass, pos, quat) {
  let box = new THREE.BoxGeometry(sx, sy, sz);
  let threeObject = new THREE.Mesh(
    box,
    new THREE.MeshPhongMaterial({ color: 0xff00aa })
  );
  // mesh.castShadow = true
  // mesh.receiveShadow = true
  threeObject.position.copy(pos);
  threeObject.quaternion.copy(quat);
  base.scene.add(threeObject);

  let boxshape = new Ammo.btBoxShape(
    new Ammo.btVector3(sx / 2, sy / 2, sz / 2)
  );
  //  boxshape.setMargin(0.5);
  let transform = new Ammo.btTransform();
  transform.setIdentity(); //设置为单位矩阵，相当于初始化
  //设置原点
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
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
  // body.setActivationState(4);
  if (mass > 0) {
    rigidBodies.push(threeObject);

    // Disable deactivation
    // body.setActivationState(4);
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
  //  controls.update()
  hinge?.enableAngularMotor(true, 0.8 * armMovement, 50);

  // Step world
  let d = clock.getDelta();
  physicsWorld.stepSimulation(d, 10);
  let softbody;
  let clothPositions;
  let numVerts;
  //  if(cloth?.userData){
  softbody = cloth.userData.physicsBody;
  clothPositions = cloth.geometry.attributes.position.array;
  numVerts = clothPositions.length / 3;
  //  }

  //  console.log(softbody)

  //  if(softbody){
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
  //  }

  if (rigidBodies.length > 0) {
    for (let i = 0; i < rigidBodies.length; i++) {
      let mesh = rigidBodies[i];
      let body = mesh.userData.physicsBody;
      let ms = body.getMotionState();
      ms.getWorldTransform(transformAux1);
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
