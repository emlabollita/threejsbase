import * as THREE from '../web_modules/three.js';
import { OrbitControls } from '../web_modules/three/examples/jsm/controls/OrbitControls.js';

export const container = document.getElementById("renderer");

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );

export const renderer = new THREE.WebGLRenderer({antialias:true});

export const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.enablePan = false;
controls.enableZoom = false;
controls.minDistance = 0.1;

camera.position.set(-0.1, 0,0);
controls.target.set(0,0,0);


function init() {

  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  renderer.setClearColor(0xb2f2ff, 1);
  
  container.appendChild( renderer.domElement );


  window.addEventListener( 'resize', onWindowResize, false );



  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

const tickCallbacks = [];

export function tick(cb) {
  const num = tickCallbacks.length;

  tickCallbacks.push(cb);
  return () => {
    delete tickCallbacks[num];
  }
}


function animate() {

  const frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
  
  tickCallbacks.forEach(cb => cb && cb(frustum));

  controls.update();

  renderer.render( scene, camera );
  requestAnimationFrame( animate );
}



init();