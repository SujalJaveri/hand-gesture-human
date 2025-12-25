let scene = new THREE.Scene();

let camera3D = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera3D.position.z = 5;

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);
