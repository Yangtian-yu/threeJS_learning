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
    this.loader.load('ciityMaterial/model/city.glb', (glb) => {
      console.log(glb)
      scene.add(glb.scene)
    })
  }
}
