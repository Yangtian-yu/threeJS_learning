import * as THREE from 'three'
export default class Base {
  constructor(canvas) {
    //场景
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000000
      // 40
    )
    this.camera.position.set(0, 0, 250)
    // this.camera.lookAt(0,0,0)
    this.camera.updateProjectionMatrix()
    //将场景中的物体
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, //是否执行抗锯齿。默认为false.
      // alpha: true  //设置为透明   fullScroll页面中 设置为ture 其他为false
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    //设置像素比,将他设置为设备像素比
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true  //开启渲染阴影计算
    // this.renderer.physicallyCorrectLights = true //开启物理上的正确光照模式

  }
  update() {
    this.renderer.render(this.scene, this.camera)
  }
  //自适应
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }
  //添加环境光
  addAmbientLight(intensity = 1, color = 0xffffff) {
    let light = new THREE.AmbientLight(color, intensity)
    this.scene.add(light)
    return light;//可以在外部修改一下他的位置等属性
  }
  //添加点光源
  addPointLight(intensity = 1, color = 0xffffff) {
    let light = new THREE.PointLight(color, intensity)
    this.scene.add(light)
    return light;//可以在外部修改一下他的位置等属性
  }
  //添加聚光灯
  addSpotLight(intensity = 1, color = 0xffffff) {
    let light = new THREE.SpotLight(color, intensity)
    this.scene.add(light)
    return light;//可以在外部修改一下他的位置等属性
  }
  //添加方向光
  addDirLight(intensity = 1, color = 0xffffff) {
    let light = new THREE.DirectionalLight({ intensity, color })
    light.castShadow = true //开启阴影
    this.scene.add(light)
    return light;//可以在外部修改一下他的位置等属性
  }
}
