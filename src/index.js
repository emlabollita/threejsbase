import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setClearColor(0x000000,0);

renderer.setSize(600, 400);

document.getElementById("renderer").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: "green" });

//const cube = new THREE.Mesh(geometry, material);

//scene.add(cube);

camera.position.z = 5;

const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.y = 10;
pointLight.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambientLight);

scene.add(pointLight);

//scene.add(new THREE.AxesHelper(800));

const control = new OrbitControls(camera, renderer.domElement);


let astronaut = null;

const gltfLoader = new GLTFLoader();
gltfLoader.load("/assets/astronaut.glb", (gltf) => {
  scene.add(gltf.scene);
  astronaut = gltf.scene;

  const copyAstronaut = astronaut.clone();

  scene.add(copyAstronaut);
  copyAstronaut.position.z = -2;
});

const fbxLoader = new FBXLoader();
fbxLoader.load("/assets/earth.fbx", (earth) => {

  scene.add(earth);

  earth.scale.set(0.05, 0.05, 0.05);

  earth.position.z = 25;

})

function animate() {
  renderer.render(scene, camera);


  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  requestAnimationFrame(animate);
}

animate();


window.addEventListener("resize", () => {
  console.log("Cambio el tamaño!", window.innerHeight)

  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.updateProjectionMatrix();
})

