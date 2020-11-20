import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointLight } from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const animate = function () {
  requestAnimationFrame( animate );

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();


const ambient = new THREE.AmbientLight(0xfffff, 1);
scene.add(ambient);


const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1.2);

scene.add(light);

light.position.set(0, -10, -30);


const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

gltfLoader.load("/assets/astronaut.glb", (gltf) => {
  scene.add(gltf.scene);

  const otherAstronaut = gltf.scene.clone();

  scene.add(otherAstronaut);

  otherAstronaut.position.z = -2;
})

fbxLoader.load("/assets/moon.fbx", (moon) => {
  scene.add(moon);
  moon.scale.set(0.05,0.05,0.05);
  moon.position.set(0,0.01,0);

  
})

fbxLoader.load("/assets/earth.fbx", (earth) => {
  scene.add(earth);
  earth.scale.set(0.1,0.1,0.1);
  earth.position.set(0,0.01,40);
})

