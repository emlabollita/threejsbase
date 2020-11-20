import * as THREE from "../web_modules/three.js";
import { scene } from "./core.js";
import { GLTFLoader } from '../web_modules/three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

gltfLoader.load("models/decorations.glb", ({scene: model}) => {
  loadDecorations(model.children);
})

const bulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.06,8,8),
  new THREE.MeshLambertMaterial()
);

const chances = [ 0,0,0,1,2 ];
const colors = [
  0xff005e,
  0x064fbd,
  0xff9818,
  0xff0000
]

const h = 2.1;
const hSegments = 12;

const coneDispersion = (x) => 27 - x*2;

const totalGlobes = (hSegments+1) * (coneDispersion(0)+coneDispersion(hSegments))/2

function loadDecorations (models) {
  const obj = {};

  
  for (let i = 0; i < 200; i++) {

    const decoration = models[chances[Math.floor(Math.random()*chances.length)]].clone();
  
    let rand = Math.floor(Math.random()*totalGlobes);

    let a;

    for (let i = 0; i <= hSegments; i++) {
      if (rand < coneDispersion(i)) {
        a = i;
        break;
      }
      rand -= coneDispersion(i);
    }

  
    const bSegments = coneDispersion(a);
  
    const b = ((Math.floor(Math.random()*bSegments)) / bSegments) * 2*Math.PI;
  
  
    const m = 0.85 - a*0.062;
  
    decoration.position.y = a*h/hSegments + 0.5;
    decoration.position.x = m*Math.cos(b);
    decoration.position.z = m*Math.sin(b);
  
    decoration.scale.x *= 0.1;
    decoration.scale.y *= 0.1;
    decoration.scale.z *= 0.1;

    decoration.rotation.y = Math.PI - b;
  
    decoration.traverse(child => {
      if (child.material && child.material.name == "Color") 
        child.material = new THREE.MeshLambertMaterial({ 
          color: colors[Math.floor(Math.random()*colors.length)] 
        });
    })

  
    scene.add(decoration)
  
  
  }
}
