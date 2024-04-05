import './style.css'

import './style.css'


//import three, GLTF,TWEEN, Orbits
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//create scene
const scene = new THREE.Scene();


const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress')

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100
}
const progressBarContainer = document.querySelector('.preloader')

const nav = document.querySelector('.navigation')
const main = document.querySelector('.maination')
const move = document.querySelector('.btn_move')


loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
  nav.style.animation = "fadeInAnimation ease 5s forwards";
  main.style.animation = "fadeInAnimation ease 5s forwards";
  move.style.animation = "fadeInAnimation ease 5s forwards";


  const targetHead = head_group.position.y + 10;
  const tweenHead = new TWEEN.Tween(head_group.position)
    .delay(1000)
    .to({ y: targetHead }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
  tweenHead.start();
}





//import GLTFs
const headphones = new GLTFLoader(loadingManager);
const plug_1 = new GLTFLoader(loadingManager);
const plug_2 = new GLTFLoader(loadingManager);
const plug_3 = new GLTFLoader(loadingManager);


const head_group = new THREE.Group();
const group_plug = new THREE.Group();

headphones.load(
  '/assets/cuffia.glb',
  (gltf) => {

    head_group.add(gltf.scene);
    updateEnv()
    gltf.scene.scale.set(0.35, 0.35, 0.35);
    gltf.scene.position.set(0, -13.3, 0);
    /* gltf.scene.rotation.y = Math.PI * 2
     gltf.scene.rotation.z = Math.PI * 0.14*/

  }
);

scene.add(head_group);

plug_1.load(
  '/assets/plug/plug_1.glb',
  (gltf) => {
    group_plug.add(gltf.scene);
    updateEnv()
    updateMat()
    gltf.scene.scale.set(0.35, 0.35, 0.35);
    gltf.scene.position.set(100, -3.3, 0);
    /* gltf.scene.rotation.y = Math.PI * 2
    gltf.scene.rotation.z = Math.PI * 0.14*/
  }
);
plug_2.load(
  '/assets/plug/plug_2.glb',
  (gltf) => {
    group_plug.add(gltf.scene);
    updateEnv()
    updateMat()
    gltf.scene.scale.set(0.35, 0.35, 0.35);
    gltf.scene.position.set(200, -3.3, 0);
    /* gltf.scene.rotation.y = Math.PI * 2
    gltf.scene.rotation.z = Math.PI * 0.14*/
  }
);
plug_3.load(
  '/assets/plug/plug_3.glb',
  (gltf) => {
    group_plug.add(gltf.scene);
    updateEnv()
    updateMat()
    gltf.scene.scale.set(0.35, 0.35, 0.35);
    gltf.scene.position.set(300, -3.3, 0);
    /* gltf.scene.rotation.y = Math.PI * 2
    gltf.scene.rotation.z = Math.PI * 0.14*/
  }
);
group_plug.position.set(0, 0, 0);
scene.add(group_plug);




//update materials and environent light
function updateEnv() {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = 4;
    }
  });
};
function updateMat() {
  scene.traverse((child) => {
    if (child.isMesh) {

      const newMaterial = new THREE.MeshStandardMaterial({
        color: 0x979FA6,
        metalness: 1,
        roughness: 0.001,
      });
      child.material = newMaterial;
    }
  });
}

//create environment map 
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  '/assets/environment map/px.png',
  '/assets/environment map/nx.png',
  '/assets/environment map/py.png',
  '/assets/environment map/ny.png',
  '/assets/environment map/pz.png',
  '/assets/environment map/nz.png',

])
scene.environment = environmentMap




//create particles
const particlesGeometry = new THREE.BufferGeometry()
const count = 15000

const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.09,
  sizeAttenuation: true
})

particlesMaterial.color = new THREE.Color('rgb(210,214,217)')

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/src/assets/particles map/particle.png')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.map = particleTexture
particlesMaterial.alphaTest = 0.001


const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)





//set sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
//create camera, render and add canvass
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 50)
camera.position.z = 7.5
scene.add(camera)
const canvas = document.querySelector('.space')
//renderizza la scena
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
})
renderer.toneMapping = THREE.ACESFilmicToneMapping
//create controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.autoRotate = true
controls.target = new THREE.Vector3(0, 0, 0)
controls.minDistance = 5;
controls.maxDistance = 14;


//definisce grandezza canvas
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
window.addEventListener("resize", () => {
  //che aggiorna il ritaglio
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //e le camere
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height);
})



const btn_rx = document.getElementById("btn_rx");
let isAnimating = false;
btn_rx.addEventListener('click', function (event) {
  if (!isAnimating) {
    isAnimating = true;
    moveRight();
    roteateZ();
  }
});


function moveRight() {

  const targetX = group_plug.position.x - 100;
  const targetYUp = group_plug.position.y + 5;
  const targetYDown = group_plug.position.y - 5;

  if (group_plug.position.x <= -300) {
    group_plug.position.x = -300; // Imposta la posizione x a -300
    isAnimating = false;
    return; // Esce dalla funzione
  }

  const tweenUp = new TWEEN.Tween(group_plug.position)
    .to({ y: targetYUp }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
    .onComplete(() => {
      tweenRight.start();
    });

  const tweenRight = new TWEEN.Tween(group_plug.position)
    .to({ x: targetX }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
    .onComplete(() => {
      tweenDown.start();
    });

  const tweenDown = new TWEEN.Tween(group_plug.position)
    .to({ y: (targetYDown + targetYUp) }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
    .onComplete(() => {
      isAnimating = false;
    });

  tweenUp.chain(tweenRight);
  tweenRight.chain(tweenDown);
  tweenUp.start();
  console.log(targetX)
}
const btn_lx = document.getElementById("btn_lx");
btn_lx.addEventListener('click', function (event) {
  if (!isAnimating) {
    isAnimating = true;
    moveLeft();
  }
});
function moveLeft() {
  const targetX = group_plug.position.x + 100;
  const targetYUp = group_plug.position.y + 5;
  const targetYDown = group_plug.position.y - 5;

  if (group_plug.position.x >= 0) {
    group_plug.position.x = 0; // Imposta la posizione x a 0
    isAnimating = false;
    return; // Esce dalla funzione
  }

  const tweenUpLeft = new TWEEN.Tween(group_plug.position)
    .to({ y: targetYUp }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
    .onComplete(() => {
      tweenLeft.start();
    });

  const tweenLeft = new TWEEN.Tween(group_plug.position)
    .to({ x: targetX }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
    .onComplete(() => {
      tweenDownLeft.start();
    });

  const tweenDownLeft = new TWEEN.Tween(group_plug.position)
    .to({ y: (targetYDown + targetYUp) }, 600)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      // Aggiorna la posizione durante l'animazione
      renderer.render(scene, camera);
    })
    .onComplete(() => {
      isAnimating = false;
    });

  tweenUpLeft.chain(tweenLeft);
  tweenLeft.chain(tweenDownLeft);
  tweenUpLeft.start();
}


const time = new THREE.Clock()

const loop = () => {
  if (group_plug.position.x === 0 & group_plug.position.y === 0) {

    document.querySelector('.btn_selection2').classList.remove('btn_selection_visibile')
    document.querySelector('.btn_selection1').classList.add('btn_selection_visibile')
  } else if (group_plug.position.x === -100 & group_plug.position.y === 0) {

    document.querySelector('.btn_selection1').classList.remove('btn_selection_visibile')
    document.querySelector('.btn_selection3').classList.remove('btn_selection_visibile')
    document.querySelector('.btn_selection2').classList.add('btn_selection_visibile')

  } else if (group_plug.position.x === -200 & group_plug.position.y === 0) {
    document.querySelector('.btn_selection2').classList.remove('btn_selection_visibile')
    document.querySelector('.btn_selection4').classList.remove('btn_selection_visibile')

    document.querySelector('.btn_selection3').classList.add('btn_selection_visibile')
  } else if (group_plug.position.x === -300 & group_plug.position.y === 0) {
    document.querySelector('.btn_selection3').classList.remove('btn_selection_visibile')

    document.querySelector('.btn_selection4').classList.add('btn_selection_visibile')
  }


  const elapsedTime = time.getElapsedTime()
  particles.rotation.y = elapsedTime * -0.15

  renderer.render(scene, camera);
  controls.update()

  TWEEN.update();
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);