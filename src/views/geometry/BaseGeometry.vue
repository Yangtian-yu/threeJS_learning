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
const canvasDom = ref(null);
onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  base.addAmbientLight(0.5); //环境光
  let dirLight = base.addDirLight(0.7); //方向光
  dirLight.position.set(-20, 10, 10);
  update();
  // createBox();
  // createCircle();
  // createCone();
  // createCylinder();
  // createDodecahedron();
  // createEdges();
  // createExtrude();
  // createLathe();
  // createPlane();
  // createRing();
  // createShape();
  // createTorusKnot();
  // createTube();
  createWireframe();
  window.addEventListener("resize", resize);
});

//#region 创建立方体
function createBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);
  base.scene.add(cube);
}
//#endregion

//#region 圆形
function createCircle() {
  const geometry = new THREE.CircleGeometry(1, 32, 0, Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const circle = new THREE.Mesh(geometry, material);
  base.scene.add(circle);
}
//#endregion

//#region 圆锥形
function createCone() {
  const geometry = new THREE.ConeGeometry(1, 2, 32, 32, true, 0, Math.PI / 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const cone = new THREE.Mesh(geometry, material);
  base.scene.add(cone);
}
//#endregion

//#region 圆柱形
function createCylinder() {
  const geometry = new THREE.CylinderGeometry(
    1,
    1,
    2,
    32,
    32,
    true,
    0,
    Math.PI
  );
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const cylinder = new THREE.Mesh(geometry, material);
  base.scene.add(cylinder);
}
//#endregion

//#region 多面体
function createDodecahedron() {
  const geometry = new THREE.DodecahedronGeometry(2, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const dodecahedron = new THREE.Mesh(geometry, material);
  base.scene.add(dodecahedron);
}
//#endregion

//#region 边缘几何体
function createEdges() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(geometry, 90);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  base.scene.add(line);
}
//#endregion

//#region 挤压缓冲几何体
function createExtrude() {
  const length = 1,
    width = 1;

  const shape = new THREE.Shape();
  shape.moveTo(0, 0); //（0,0）作为原起始点
  shape.lineTo(1, 0); // currentpoint === (1,0)
  shape.lineTo(1, 1);
  shape.lineTo(0, 1);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 2,
    depth: 2,
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  base.scene.add(mesh);
}

//#endregion

//#region 车削缓冲几何体
function createLathe() {
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
  }
  const geometry = new THREE.LatheGeometry(points);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const lathe = new THREE.Mesh(geometry, material);
  base.scene.add(lathe);
}
//#endregion

//#region 平面缓冲几何体
function createPlane() {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  base.scene.add(plane);
}
//#endregion

//#region 圆环缓冲几何体
function createRing() {
  const geometry = new THREE.RingGeometry(0.5, 2, 32, 32, 0, Math.PI);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  base.scene.add(mesh);
}
//#endregion

//#region 形状缓冲几何体
function createShape() {
  const x = 0,
    y = 0;

  const heartShape = new THREE.Shape();

  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
  let points = heartShape.getPoints(); //获取所有点位置
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  }); //线段基础材质
  const mesh = new THREE.Line(geometry, material);
  base.scene.add(mesh);

  let box1 = new THREE.BoxGeometry(2, 2, 2);
  let mat1 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  let mesh1 = new THREE.Mesh(box1, mat1);
  mesh1.position.set(0, 0, 0);
  base.scene.add(mesh1);
}
//#endregion

//#region 圆环缓冲扭结几何体
function createTorusKnot() {
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  base.scene.add(torusKnot);
}
//#endregion

//#region 管道缓冲几何体
function createTube() {
  class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
      super();

      this.scale = scale;
    }
    //t:0-1浮点数
    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const tx = t * 3 - 1.5; //-1.5到1.5
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;

      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const path = new CustomSinCurve(10);
  const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  base.scene.add(mesh);
}
//#endregion

//#region 网格几何体
function createWireframe() {
  const geometry = new THREE.SphereGeometry(1, 100, 100);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const line = new THREE.LineSegments(wireframe);
  line.material.depthTest = false;
  line.material.opacity = 0.25;
  line.material.transparent = true;
  base.scene.add(line);
}
//#endregion

function update() {
  requestAnimationFrame(update);
  base.updated();
  controls.update();
}
function resize() {
  base.resize();
}
// function createBox() {
//   //存放的是一些位置信息（不是实体）
//   let box = new THREE.BoxGeometry(1, 1, 1);
//   let mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//   let mesh = new THREE.Mesh(box, mat);
//   base.scene.add(mesh);
// }
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
