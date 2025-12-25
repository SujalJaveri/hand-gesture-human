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
