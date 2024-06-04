import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as  THREE from 'three'
import gsap from 'gsap'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export default class City {
  constructor(scene) {
    //载入模型
    this.scene = scene
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("ciityMaterial/draco/");
    this.loader.setDRACOLoader(dracoLoader);
    this.loader.load('ciityMaterial/model/city3.glb', (glb) => {
      console.log(glb)
      scene.add(glb.scene)


      this.glb = glb;
      //场景子元素遍历
      glb.scene.traverse((child) => {
        if (child.name === '热气球') {
          console.log(child)
          this.mixer = new THREE.AnimationMixer(child);
          this.clip = glb.animations[0];
          this.action = this.mixer.clipAction(this.clip);
          this.action.play()
        }
      })
    })
  }
  update(time) {
    if (this.mixer) {
      this.mixer.update(time)
    }
  }
}
