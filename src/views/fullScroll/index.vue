<template>
  <div class="container">
    <div class="page page0">
      <h1>Ray投射光线</h1>
      <h4>THREE.Raycaster实现3d交互效果</h4>
    </div>
    <div class="page page1">
      <h1>THREE.BufferGeometry！</h1>
      <h4>应用打造酷炫的三角形</h4>
    </div>
    <div class="page page2">
      <h1>活泼点光源</h1>
      <h4>点光源围绕照亮小球</h4>
    </div>
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
// 导入动画库
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let base,
  controls,
  cubeGroup,
  sjxGroup,
  sphereGroup,
  arrGroup,
  smallBall,
  mouse;

const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  // controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.camera.position.set(0, 0, 18);
  createAxesHelper();
  createInteractionScene();
  update();
  window.addEventListener("resize", resize);
});

const createInteractionScene = () => {
  //100个立方体
  let cubeArr = [];
  cubeGroup = new THREE.Group();
  const geo = new THREE.BoxBufferGeometry(2, 2, 2);
  delete geo.attributes.uv;
  const mat = new THREE.MeshBasicMaterial({
    wireframe: true,
  });
  const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let z = 0; z < 5; z++) {
        const cube = new THREE.Mesh(geo, mat);
        cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4);
        cubeGroup.add(cube);
        cubeArr.push(cube);
      }
    }
  }

  // 创建三角形酷炫物体
  // 添加物体
  // 创建几何体
  sjxGroup = new THREE.Group();
  for (let i = 0; i < 50; i++) {
    // 每一个三角形，需要3个顶点，每个顶点需要3个值
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
      if (j % 3 == 1) {
        positionArray[j] = Math.random() * 10 - 5;
      } else {
        positionArray[j] = Math.random() * 10 - 5;
      }
    }
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    // 根据几何体和材质创建物体
    let sjxMesh = new THREE.Mesh(geometry, material);
    //   console.log(mesh);
    sjxGroup.add(sjxMesh);
  }
  sjxGroup.position.set(0, -30, 0);

  // 弹跳小球
  sphereGroup = new THREE.Group();
  const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
  const spherematerial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  });
  const sphere = new THREE.Mesh(sphereGeometry, spherematerial);
  // 投射阴影
  sphere.castShadow = true;

  sphereGroup.add(sphere);

  // // 创建平面
  const planeGeometry = new THREE.PlaneBufferGeometry(20, 20);
  const plane = new THREE.Mesh(planeGeometry, spherematerial);
  plane.position.set(0, -1, 0);
  plane.rotation.x = -Math.PI / 2;
  // 接收阴影
  plane.receiveShadow = true;
  sphereGroup.add(plane);

  // 灯光
  // 环境光
  const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  sphereGroup.add(light);

  smallBall = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  smallBall.position.set(2, 2, 2);
  //直线光源
  const pointLight = new THREE.PointLight(0xff0000, 3);
  // pointLight.position.set(2, 2, 2);
  pointLight.castShadow = true;

  // 设置阴影贴图模糊度
  pointLight.shadow.radius = 20;
  // 设置阴影贴图的分辨率
  pointLight.shadow.mapSize.set(512, 512);

  // 设置透视相机的属性
  smallBall.add(pointLight);
  sphereGroup.add(smallBall);

  sphereGroup.position.set(0, -60, 0);

  base.scene.add(sphereGroup);
  base.scene.add(sjxGroup);
  base.scene.add(cubeGroup);

  arrGroup = [cubeGroup, sjxGroup, sphereGroup];

  //鼠标的位置对象
  mouse = new THREE.Vector2();
  //创建投射光线对象
  const raycaster = new THREE.Raycaster();
  // 监听鼠标的位置
  window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, base.camera);
    let result = raycaster.intersectObjects(cubeArr);
    result.forEach((item) => {
      item.object.material = redMat;
    });
  });

  // 设置当前页
  let currentPage = 0;
  // 监听滚动事件
  window.addEventListener("scroll", () => {
    //   console.log(window.scrollY);
    const newPage = Math.round(window.scrollY / window.innerHeight);
    if (newPage != currentPage) {
      currentPage = newPage;
      console.log("改变页面，当前是：" + currentPage);
      gsap.to(arrGroup[currentPage].rotation, {
        z: "+=" + Math.PI * 2,
        x: "+=" + Math.PI * 2,
        duration: 2,
      });
      gsap.fromTo(
        `.page${currentPage} h1`,
        { x: -300 },
        { x: 0, rotate: "+=360", duration: 1 }
      );
    }
  });

  // 监听鼠标的位置
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
  });

  gsap.to(cubeGroup.rotation, {
    x: "+=" + Math.PI * 2,
    y: "+=" + Math.PI * 2,
    duration: 10,
    ease: "power2.inOut",
    repeat: -1,
  });
  gsap.to(sjxGroup.rotation, {
    x: "-=" + Math.PI * 2,
    z: "+=" + Math.PI * 2,
    duration: 12,
    ease: "power2.inOut",
    repeat: -1,
  });
  gsap.to(smallBall.position, {
    x: -3,
    duration: 6,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });
  gsap.to(smallBall.position, {
    y: 0,
    duration: 0.5,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(20);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

const clock = new THREE.Clock();

function update() {
  const time = clock.getElapsedTime();

  // cubeGroup.rotation.x = time * 0.5;
  // cubeGroup.rotation.y = time * 0.5;
  // sjxGroup.rotation.x = time * 0.5;
  // sjxGroup.rotation.y = time * 0.5;
  // smallBall.position.x = Math.sin(time) * 3;
  // smallBall.position.z = Math.cos(time) * 3;
  // smallBall.position.y = 2 + Math.sin(time * 10) / 2;
  // sphereGroup.rotation.z = Math.sin(time) * 0.05;
  // sphereGroup.rotation.x = Math.sin(time) * 0.05;
  //根据当前滚动的scrollY，去设置相机移动的位置
  base.camera.position.y = -(window.scrollY / window.innerHeight) * 30;
  base.camera.position.x += (mouse.x * 10 - base.camera.position.x) * 0.1;

  base.update();
  // controls.update();
  requestAnimationFrame(update);
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: rgb(36, 58, 66);
}
#canvasDom {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
.page {
  height: 100vh;
  display: flex;
  color: #fff;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: relative;
  text-align: end;
  /* z-index: 20; */
}
.page h1 {
  margin: 30px;
  font-size: 30px;
}

.page h3 {
  font-size: 30px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
