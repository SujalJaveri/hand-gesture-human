const canvas = document.getElementById('canvas');
const video = document.getElementById('video');
const scene = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

let human;
const loader = new THREE.OBJLoader();
loader.load('human.obj', function(object) {
  human = object;
  human.scale.set(0.02, 0.02, 0.02);
  scene.add(human);
  console.log('Model loaded');
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);
camera3D.position.z = 8;

let hands = null;

navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    console.log('Camera started');
  })
  .catch(err => console.error('Camera error:', err));

if (typeof Hands !== 'undefined') {
  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  hands.onResults((results) => {
    if (!human || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;
    const landmarks = results.multiHandLandmarks[0];
    const palmX = landmarks[9].x;
    const palmY = landmarks[9].y;
    const speed = 0.05;
    if (palmX < 0.4) human.position.x -= speed;
    if (palmX > 0.6) human.position.x += speed;
    if (palmY < 0.4) human.position.y += speed;
    if (palmY > 0.6) human.position.y -= speed;
  });

  video.onloadedmetadata = () => {
    const videoSource = new (window.SourceProcessor || class {
      constructor() {}
      onFrame(callback) {
        const processFrame = () => {
          callback({ image: video });
          requestAnimationFrame(processFrame);
        };
        processFrame();
      }
    })();
    
    const processFrame = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        hands.send({ image: video });
      }
    }, 30);
  };
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera3D);
}
animate();
