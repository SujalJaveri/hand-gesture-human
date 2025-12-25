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

let model = null;
const loader = new THREE.OBJLoader();
loader.load('human.obj', (object) => {
  model = object;
  model.scale.set(0.01, 0.01, 0.01);
  scene.add(model);
  console.log('Model loaded');
}, undefined, (err) => {
  console.error('Model error:', err);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

console.log('Render loop started');
