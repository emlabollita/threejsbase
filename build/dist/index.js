import * as THREE from '../web_modules/three.js';

import {
  scene,
  camera,
  controls,
} from "./core.js";

import Item from "./item/index.js";
import items from "./items.config.js";

scene.add(new THREE.AmbientLight("white", 1))

const textureLoader = new THREE.TextureLoader();

textureLoader.loadAsync("360_background.jpg")
  .then(texture => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(10,30,30),
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      })
    )

    scene.add(sphere)
  })

items.forEach(item => new Item(item));


// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(10,10,1,1),
//   new THREE.MeshPhongMaterial({ color: "blue" })
// );

// plane.rotation.x = -Math.PI/2;

// scene.add(plane)