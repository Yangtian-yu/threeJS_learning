import { createRouter, createWebHashHistory } from 'vue-router'
import Base from "../views/Base.vue"
const routers = [
  {
    name: "base",
    path: "/",
    meta: {
      title: "首页"
    },
    component: Base,
  },
  {
    name: "BaseGeometry",
    path: "/geometry/BaseGeometry",
    meta: {
      title: "几何体"
    },
    component: () => import('../views/geometry/BaseGeometry.vue'),
  },
  {
    name: "BaseFont",
    path: "/Font/BaseFont",
    meta: {
      title: "字体"
    },
    component: () => import('../views/Font/BaseFont.vue'),
  },
  {
    name: "Flow",
    path: "/Font/Flow",
    meta: {
      title: "字体轨迹运动"
    },
    component: () => import('../views/Font/Flow.vue'),
  },
  {
    name: "MirrorFont",
    path: "/Font/MirrorFont",
    meta: {
      title: "字体倒影"
    },
    component: () => import('../views/Font/MirrorFont.vue'),
  },
  {
    name: "BaseCurve",
    path: "/Curve/BaseCurve",
    meta: {
      title: "曲线"
    },
    component: () => import('../views/Curve/BaseCurve.vue'),
  },
  {
    name: "Shape",
    path: "/Curve/Shape",
    meta: {
      title: "孔洞"
    },
    component: () => import('../views/Curve/Shape.vue'),
  },
  {
    name: "MicsAnimation",
    path: "/animation/MicsAnimation",
    meta: {
      title: "动画"
    },
    component: () => import('../views/animation/MicsAnimation.vue'),
  },
  {
    name: "Css2dLable",
    path: "/css2d/Css2dLable",
    meta: {
      title: "2D旋转"
    },
    component: () => import('../views/css2d/Css2dLable.vue'),
  },
  {
    name: "css3dMolecules",
    path: "/css3d/css3dMolecules",
    meta: {
      title: "3D模型"
    },
    component: () => import('../views/css3d/css3dMolecules.vue'),
  },
  {
    name: "css3dPeriodictable",
    path: "/css3d/css3dPeriodictable",
    meta: {
      title: "3d元素周期表"
    },
    component: () => import('../views/css3d/css3dPeriodictable.vue'),
  },
  {
    name: "testAmmo",
    path: "/ammo/testAmmo",
    meta: {
      title: "物理渲染引擎"
    },
    component: () => import('../views/Ammo/testAmmo.vue'),
  },
  {
    name: "Ammo1",
    path: "/ammo/Ammo1",
    meta: {
      title: "物理渲染引擎案例1"
    },
    component: () => import('../views/Ammo/Ammo1.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers
})

export default router
