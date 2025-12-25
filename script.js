let human;

const loader = new THREE.OBJLoader();
loader.load(
  "models/human.obj",
  object => {
    human = object;
    human.scale.set(0.02, 0.02, 0.02); // OBJ models are usually HUGE
    scene.add(human);
  },
  xhr => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  error => {
    console.error("OBJ load error", error);
  }
);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);
let human;

const loader = new THREE.OBJLoader();
loader.load("models/human.obj", obj => {
  human = obj;
  human.scale.set(0.02, 0.02, 0.02); // OBJ models are huge
  scene.add(human);
});
