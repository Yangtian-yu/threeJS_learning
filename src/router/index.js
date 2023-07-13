import { createRouter, createWebHashHistory } from 'vue-router'
import Base from "../views/Base.vue"
import Main from '../views/main/main.vue'
// 哔哩哔哩课程
const baserouter = [
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
  {
    name: "Ammo2",
    path: "/ammo/Ammo2",
    meta: {
      title: "物理渲染引擎案例2"
    },
    component: () => import('../views/Ammo/Ammo2.vue'),
  },
  {
    name: "softAmmo",
    path: "/ammo/softAmmo",
    meta: {
      title: "物理渲染引擎案例3"
    },
    component: () => import('../views/Ammo/softAmmo.vue'),
  },
  {
    name: "softAmmo1",
    path: "/ammo/softAmmo1",
    meta: {
      title: "物理渲染引擎案例4"
    },
    component: () => import('../views/Ammo/softAmmo1.vue'),
  },
  {
    name: "softAmmofially",
    path: "/ammo/softAmmofially",
    meta: {
      title: "物理渲染引擎案例终"
    },
    component: () => import('../views/Ammo/softAmmofially.vue'),
  },
]
//老陈打码视频
const newRouter = [
  {
    name: "base",
    path: "/",
    meta: {
      title: "基础"
    },
    component: Main,
  },
  {
    name: "main01",
    path: "/main/main01",
    meta: {
      title: "添加控制器"
    },
    component: () => import('../views/main/main01.vue'),
  },
  {
    name: "main02",
    path: "/main/main02",
    meta: {
      title: "添加辅助线"
    },
    component: () => import('../views/main/main02.vue'),
  },
  {
    name: "main03",
    path: "/main/main03",
    meta: {
      title: "旋转缩放移动基础应用"
    },
    component: () => import('../views/main/main03.vue'),
  },
  {
    name: "main04",
    path: "/main/main04",
    meta: {
      title: "gasp库使用"
    },
    component: () => import('../views/main/main04.vue'),
  },
  {
    name: "main06",
    path: "/main/main06",
    meta: {
      title: "基础材质贴图"
    },
    component: () => import('../views/main/main06.vue'),
  },
  {
    name: "main07",
    path: "/main/main07",
    meta: {
      title: "光线与标准材质"
    },
    component: () => import('../views/main/main07.vue'),
  },
  {
    name: "main08",
    path: "/main/main08",
    meta: {
      title: "环境贴图"
    },
    component: () => import('../views/main/main08.vue'),
  },
  {
    name: "main09",
    path: "/main/main09",
    meta: {
      title: "灯光与阴影"
    },
    component: () => import('../views/main/main09.vue'),
  },
  {
    name: "main10",
    path: "/main/main10",
    meta: {
      title: "聚光灯"
    },
    component: () => import('../views/main/main10.vue'),
  },
  {
    name: "main11",
    path: "/main/main11",
    meta: {
      title: "点光源"
    },
    component: () => import('../views/main/main11.vue'),
  },
  {
    name: "particle1",
    path: "/particle/particle1",
    meta: {
      title: "点光源"
    },
    component: () => import('../views/particle/particle1.vue'),
  },
  {
    name: "particle2",
    path: "/particle/particle2",
    meta: {
      title: "银河"
    },
    component: () => import('../views/particle/particle2.vue'),
  },
  {
    name: "particle3",
    path: "/particle/particle3",
    meta: {
      title: "雪花"
    },
    component: () => import('../views/particle/particle3.vue'),
  },
  {
    name: "particle4",
    path: "/particle/particle4",
    meta: {
      title: "臂旋星系"
    },
    component: () => import('../views/particle/particle4.vue'),
  },
  {
    name: "main12",
    path: "/main/main12",
    meta: {
      title: "光线投射实现物体交互"
    },
    component: () => import('../views/main/main12.vue'),
  },
  {
    name: "fullScroll",
    path: "/fullScroll/fullScroll",
    meta: {
      title: "全屏滑动案例"
    },
    component: () => import('../views/fullScroll/index.vue'),
  },
  {
    name: "physics01",
    path: "/physics01",
    meta: {
      title: "物理引擎案例"
    },
    component: () => import('../views/physics/physics01.vue'),
  },
  {
    name: "newCurve",
    path: "/newCurve",
    meta: {
      title: "曲线应用"
    },
    component: () => import('../views/newCurve/curve.vue'),
  },
  {
    name: "shader1",
    path: "/shader1",
    meta: {
      title: "着色器"
    },
    component: () => import('../views/shader/shader1.vue'),
  },
  {
    name: "smartCity",
    path: "/smartCity",
    meta: {
      title: "mini智慧城市"
    },
    component: () => import('../views/smartCity/index.vue'),
  },
  {
    name: "smartPark",
    path: "/smartPark",
    meta: {
      title: "mini智慧园区"
    },
    component: () => import('../views/SmartPark/index.vue'),
  },
]


const routers = newRouter


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers
})

export default router
