const video = document.getElementById("video");

// Camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

// MediaPipe Hands
const hands = new Hands({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});
