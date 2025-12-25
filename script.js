// Three.js Scene Setup
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

// Step 5: Load .obj Model
let human;
const loader = new THREE.OBJLoader();
loader.load(
'./human.obj'  (object) => {
    human = object;
    human.scale.set(0.02, 0.02, 0.02);
    scene.add(human);
    console.log('Human model loaded');
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error);
  }
);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

camera3D.position.z = 8;

// MediaPipe Hands
const video = document.getElementById('video');
let hands;

const onResults = (results) => {
  if (!human) return;
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

  const landmarks = results.multiHandLandmarks[0];
  const palmX = landmarks[9].x;
  const palmY = landmarks[9].y;
  const speed = 0.05;

  if (palmX < 0.4) human.position.x -= speed;
  if (palmX > 0.6) human.position.x += speed;

  if (palmY < 0.4) human.position.y += speed;
  if (palmY > 0.6) human.position.y -= speed;
};

if (typeof Hands !== 'undefined') {
  hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  if (typeof Camera !== 'undefined') {
    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
    console.log('Camera started');
  }
}

// Step 7: Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();

console.log('Script ready');}
