// Three.js Scene Setup
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

// MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Camera Setup
const video = document.getElementById('video');
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 1280,
  height: 720,
});
camera.start();

// Step 5: Load .obj Model
let human;
const loader = new THREE.OBJLoader();
loader.load(
  "human.obj",
  (object) => {
    human = object;
    human.scale.set(0.02, 0.02, 0.02); // OBJ models are usually HUGE
    scene.add(human);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("OBJ load error", error);
  }
);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Adjust Camera
camera3D.position.z = 8;

// Step 6: Gesture Detection & Movement
hands.onResults((results) => {
  if (!human) return;
  if (!results.multiHandLandmarks) return;

  const lm = results.multiHandLandmarks[0];
  const x = lm[9].x; // palm center
  const y = lm[9].y;
  const speed = 0.05;

  // LEFT / RIGHT
  if (x < 0.4) human.position.x -= speed;
  if (x > 0.6) human.position.x += speed;

  // UP / DOWN
  if (y < 0.4) human.position.y += speed;
  if (y > 0.6) human.position.y -= speed;
});

// Step 7: Animate Scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();
