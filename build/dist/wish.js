import * as THREE from "../web_modules/three.js";
import { camera, controls, tick, container} from "./core.js";

const h1 = document.createElement("h1");
h1.id = "wish_button";
h1.textContent = "Pide un deseo"
container.insertAdjacentElement("afterend", h1);

function interpolate(from, to, duration, cb, _all = []) {
  let timeElapsed = 0;

  // if (to === undefined) {
  //   return {
  //     to: (to, duration, cb) => interpolate(from, to, duration, cb, _all)
  //   }
  // }

  if (duration === undefined) {
    return {
      in: (duration, cb) => interpolate(from, to, duration, cb, _all),
      and: (from, to, cb) => {
        return interpolate(from, to, duration, cb, _all)
      },
    }
  }


  if (from != null && to != null){
    _all.push({
      from, to, duration
    })
  }

  //if (duration !== undefined) _all[0].duration = duration;

  if (!cb) {
    return {
      and: (from, to, cb) => {
        return interpolate(from, to, duration, cb, _all)
      },
      then: (cb) => {
        return interpolate(null, null, null, cb, _all)
      }
    }
  }

  return new Promise((res, rej) => {
    const done = tick(() => {
      timeElapsed += 1/60;
      
      if (timeElapsed > _all[0].duration) {
        res();
        return done();
      } 

      console.log(_all)

      cb(
        _all.length == 1
          ? from + (timeElapsed * (to - from))/duration
          : _all.map(({from, to}) => {
            console.log(`${from.toFixed(2)} -> ${to.toFixed(2)} (${timeElapsed}/${_all[0].duration})`)
            return from + (timeElapsed * (to - from))/(_all[0].duration)
          })
      );
    });
  });
}

h1.addEventListener("click", () => {
  controls.enabled = false;

  const angle = Math.atan2(camera.position.x, camera.position.z);
  const distance = camera.position.distanceTo(controls.target);

  // interpolate(angle, 0, 0.5, (angle) => {
  //   camera.position.x = distance*Math.sin(angle);
  //   camera.position.z = distance*Math.cos(angle);
  // });

  interpolate(distance, 0.1, 1)
    .and(controls.target.y, 2.6)
    .and(angle, 0)
    .and(camera.position.y, 2.6)
    .then(([distance, targetY, angle, cameraY]) => {
      console.log(angle,distance)
      camera.position.x = distance*Math.sin(angle);
      camera.position.z = distance*Math.cos(angle);
      controls.target.y = targetY;
      camera.position.y = cameraY;
    })
    .then(() => {
      console.log("dea")
    });
})

// const cameraAnim = {
//   target: {
//     position: new THREE.Vector3(0,0,0),
//     target: new THREE.Vector3(0,0,0),
//   },
//   last: {
//     position: new THREE.Vector3(0,0,0),
//     target: new THREE.Vector3(0,0,0),
//   },
//   time: 0,
//   duration: 0,
// }
// export function moveCameraTo(position, target, duration = 0.3) {
//   cameraAnim.last.position = camera.position.clone();
//   cameraAnim.last.target = camera.target.clone();
//   cameraAnim.target.position = new THREE.Vector3(position.x, position.y, position.z);
//   cameraAnim.target.target = new THREE.Vector3(target.x, target.y, target.z);
//   cameraAnim.duration = duration;
//   cameraAnim.duration = 0;
// }