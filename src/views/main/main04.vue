<template>
  <canvas ref="canvasDom" id="canvasDom"></canvas>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import Base from "../Base";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let base, controls, animate1, gui;
const canvasDom = ref(null);

onMounted(() => {
  base = new Base(canvasDom.value);
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  //设置控制器的阻尼，让控制器更有真实效果
  controls.enableDamping = true;
  base.camera.position.set(0, 0, 10);
  createBox();
  createAxesHelper();
  useGsap();
  update();
  createGUI();
  console.log(base);
  //双击屏幕暂停
  window.addEventListener("dblclick", dblclick);
  window.addEventListener("resize", resize);
});

const createBox = () => {
  //添加物体
  //创建几何体
  const cube = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(cube, mat);

  //修改物体的位置
  // mesh.position.set(5, 0, 0);
  base.scene.add(mesh);
};

const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(10);
  base.scene.add(axesHelper);
};

function resize() {
  base.resize();
}

function useGsap() {
  const mesh = base.scene.children[0];
  //设置动画
  animate1 = gsap.to(mesh.position, {
    x: 5,
    duration: 5,
    //设置重复的次数，无限次循环
    repeat: -1,
    //往返运动
    yoyo: true,
    //延迟时间
    delay: 2,
    ease: "power1.inout",
    onComplete: () => {
      console.log("动画完成");
    },
    onStart: () => {
      console.log("动画开始");
    },
  });
  gsap.to(mesh.rotation, { x: Math.PI * 2, duration: 5, ease: "power1.inout" });
}

const dblclick = () => {
  //#region  控制动画暂停
  if (animate1.isActive()) {
    //   暂停
    animate1.pause();
  } else {
    //   恢复
    animate1.resume();
  }
  //#endregion
  // matter/textures/particles/1.png
  //#region  控制全屏
  const fullscreenElelment = document.fullscreenElement;
  if (!fullscreenElelment) {
    base.renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
  //#endregion
};

const createGUI = () => {
  const mesh = base.scene.children[0];
  let layers = {
    暂停: () => {
      animate1.pause();
    },
    移动: () => {
      animate1.resume();
    },
  };
  gui = new GUI();
  gui.add(layers, "暂停");
  gui.add(layers, "移动");
  //改变位置
  // gui
  //   .add(mesh.position, "x")
  //   .min(0)
  //   .max(5)
  //   .step(0.1)
  //   .name("改变x轴位置")
  //   .onChange((value) => {
  //     console.log("值被修改了值：", value);
  //   })
  //   .onFinishChange((value) => {
  //     console.log("结束修改了:", value);
  //   });
  //改变颜色
  const params = {
    color: "#ffff00",
    fn: () => {
      //让立方体运动起来
      gsap.to(mesh.position, { x: 5, duration: 2, yoyo: true });
    },
  };
  gui.addColor(params, "color").onChange((value) => {
    mesh.material.color.set(value);
  });
  //是选项框
  gui.add(mesh, "visible").name("是否显示");
  //点击触发事件按钮
  gui.add(params, "fn").name("立方体运动起来");
  //
  let far = gui.addFolder("设置立方体");
  far.add(mesh.material, "wireframe");
};

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
