import * as THREE from "../../web_modules/three.js";

import ItemUi from "./ui.js";

import { scene, camera, tick } from "../core.js";

import {OBJLoader} from "../../web_modules/three/examples/jsm/loaders/OBJLoader.js";
import {FBXLoader} from "../../web_modules/three/examples/jsm/loaders/FBXLoader.js";
import {MTLLoader} from "../../web_modules/three/examples/jsm/loaders/MTLLoader.js";
import {GLTFLoader} from "../../web_modules/three/examples/jsm/loaders/GLTFLoader.js";

class Item {
  constructor(data) {
    this.type = "item";

    this.position = new THREE.Vector3(data.x, data.y, data.z);
    this.rotateAxis = data.rotate;
    this.focused = false;
    this.focusedSize = data.focusedSize || data.size || 1;
    this.size = data.size || 1;
    this.iconHeight = data.iconHeight || 0;

    this.description = data.description;
    this.title = data.title;
    this.src = data.src;
    this.video = data.video;
    this.elements = data.elements;
    this.more = data.more;

    const textureLoader = new THREE.TextureLoader();
    const objLoader = new OBJLoader();
    const fbxLoader = new FBXLoader();
    const mtlLoader = new MTLLoader();
    const gltfLoader = new GLTFLoader();

    this.focus = this.focus.bind(this);
    this.unfocus = this.unfocus.bind(this);
    this.rotate = this.rotate.bind(this);
    this.remove = this.remove.bind(this);
    this.tick = this.tick.bind(this);

    if (!data.src) return this;

    const ext = data.src.slice(-3);

    if (ext == "jpg") {

      textureLoader.load(data.src, (texture) => {
        
        console.log(texture)

        const aspectRatio = texture.image.width / texture.image.height

        this.object = new THREE.Mesh(
          new THREE.PlaneGeometry(aspectRatio,1),
          new THREE.MeshBasicMaterial({map:texture, side: THREE.DoubleSide})
        );
        
        this.object.rotation.y = data.rotation;
        
        this.object.position.copy(this.position);
        
        this.object.scale.set(data.size, data.size, data.size)
        
        scene.add(this.object);
      })
    }
    else if (ext == "glb" || ext == "fbx" || ext == "obj") {
      let load;

      if (ext == "obj") {
        load = new Promise((res, rej) => {
          mtlLoader.load(data.src.replace(".obj",".mtl"), (material) => {
            objLoader.setMaterials(material);
            objLoader.load(data.src, res)
          });
        });
      } 
      else if (ext == "fbx") {
        load = new Promise((res, rej) => fbxLoader.load(data.src, res));
      }
      else if (ext == "glb") {
        load = new Promise((res, rej) => gltfLoader.load(data.src, model => res(model.scene)));
      }

      load.then((object) => {
        this.object = object;
        this.object.position.copy(this.position);
        this.object.rotation.set(0,data.rotation,0);
        this.object.scale.set(data.size, data.size, data.size)

        
        scene.add(this.object);
      })
    }

    this.icon = document.createElement("img");

    if (data.video) this.icon.src = "/icons/play.png";
    else this.icon.src = "/icons/see.png";

    this.icon.classList.add("icon");
    this.icon.style.display = "none";
    this.icon.setAttribute("draggable", false)

    document.getElementById("ui").insertAdjacentElement("beforeend", this.icon);

    this.icon.addEventListener("mousedown", this.focus);

    tick(this.tick)
  }

  focus () {

    this.ui = new ItemUi({
      init: () => ({ 
        description: this.description,
        src: this.src,
        video: this.video,
        title: this.title,
        more: this.more,
        elements: this.elements,
      }),
      unfocus: () => {
        this.unfocus();
      }
    });    

    this.focused = true;


    if (!this.object || this.video || this.elements) return;

    this.target = this.object.clone();
    this.object.visible = false;

    let focusedVec = camera.localToWorld(new THREE.Vector3(0.35,-0.1,-1));

    this.target.position.copy(focusedVec);
    console.log(this.focusedSize/this.size)
    //this.target.position.y -= this.iconHeight*(this.focusedSize/this.size);
    this.target.rotation.y = camera.rotation.y - Math.PI/2;
    
    this.target.scale.set(this.focusedSize*0.5, this.focusedSize*0.4, this.focusedSize*0.4);

    scene.add(this.target);
    
    if (this.rotateAxis) window.addEventListener("mousemove", this.rotate)

  }

  rotate (e) {
    if (!this.startX) {
      this.startX = e.clientX;
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    
    let xRot = this.target.rotation.y;

    this.target.rotation.y = camera.rotation.y - Math.PI/2 + (x - this.startX)*(Math.PI/(0.5*window.innerWidth));
 
  }

  unfocus () {
    this.focused = false;

    this.startX = null;


    if (this.target && this.object) { 
      scene.remove(this.target);
      this.object.visible = true;
    }

    if (this.rotateAxis) window.removeEventListener("mousemove", this.rotate)

    this.ui && this.ui.close();
    this.ui = null;
  }

  remove() {
    scene.remove(this.object);
    this.target && scene.remove(this.target);
    this.ui && this.ui.close();

  }

  tick (frustum) {

    const iconVector = this.position.clone();

    iconVector.y += this.iconHeight;

    if(!this.focused && frustum && frustum.containsPoint(iconVector)) {
      
      iconVector.project(camera);
      const x = (iconVector.x *  .5 + .5) * window.innerWidth;
      const y = (iconVector.y * -.5 + .5) * window.innerHeight;

      this.icon.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      this.icon.style.display = "";
    } else {
      this.icon.style.display = "none";
    }
  }
}

export default Item;