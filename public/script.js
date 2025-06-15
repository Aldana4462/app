const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

function draw() {
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

draw();
