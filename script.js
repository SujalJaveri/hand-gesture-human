const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

console.log('Script started');

navigator.mediaDevices.getUserMedia({
  video: true
}).then(stream => {
  video.srcObject = stream;
  console.log('Camera started successfully');
}).catch(err => {
  console.error('Camera error:', err);
  alert('Camera error: ' + err.message);
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let model = new THREE.Group();const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffa500 }));head.position.y = 2;model.add(head);const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.5, 32), new THREE.MeshStandardMaterial({ color: 0x0000ff }));body.position.y = 0.7;model.add(body);const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32), new THREE.MeshStandardMaterial({ color: 0xffa500 }));leftArm.rotation.z = Math.PI / 2;leftArm.position.set(-0.8, 1, 0);model.add(leftArm);const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32), new THREE.MeshStandardMaterial({ color: 0xffa500 }));rightArm.rotation.z = Math.PI / 2;rightArm.position.set(0.8, 1, 0);model.add(rightArm);const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 32), new THREE.MeshStandardMaterial({ color: 0x000000 }));leftLeg.position.set(-0.2, -1.2, 0);model.add(leftLeg);const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 32), new THREE.MeshStandardMaterial({ color: 0x000000 }));rightLeg.position.set(0.2, -1.2, 0);model.add(rightLeg);scene.add(model);console.log('3D Human model created');

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

console.log('Render loop started');

// Hand gesture detection with MediaPipe
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
      });

let lastHandX = 0;
let lastHandY = 0;

hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          const palmCenter = landmarks[9]; // Palm center landmark

          // Normalize coordinates to screen space
          const screenX = palmCenter.x * 2 - 1; // Convert to -1 to 1
          const screenY = -(palmCenter.y * 2 - 1);

          // Move the model based on hand position
          model.position.x += (screenX - lastHandX) * 0.05;
          model.position.y += (screenY - lastHandY) * 0.05;

          lastHandX = screenX;
          lastHandY = screenY;
        }
  });

const handCamera = new Camera(video, {
    onFrame: async () => {
          await hands.send({image: video});
        },
    width: 1280,
    height: 720
      });
handCamera.start();

console.log('Hand gesture detection initialized');
