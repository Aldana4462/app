const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

const imageUrls = [
  'https://i.ibb.co/MybXCVBR/Los-Angeles-Heavyweight-Crewneck-Sweatshirt-Front.png',
  'https://i.ibb.co/KzBQvgW9/Max-Heavyweight-Garment-Dye-T-Shirt-Front.png'
];

const images = [];
let currentIndex = 0;
let zoom = 1;

function loadImages(callback) {
  let loaded = 0;
  imageUrls.forEach((src, i) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      images[i] = img;
      loaded++;
      if (loaded === imageUrls.length) callback();
    };
    img.src = src;
  });
}

function drawImage() {
  const img = images[currentIndex];
  if (!img) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaledWidth = img.width * zoom;
  const scaledHeight = img.height * zoom;
  const x = (canvas.width - scaledWidth) / 2;
  const y = (canvas.height - scaledHeight) / 2;
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
}

function changeImage(delta) {
  currentIndex = (currentIndex + delta + images.length) % images.length;
  drawImage();
}

function changeZoom(factor) {
  zoom = Math.min(Math.max(0.5, zoom * factor), 5);
  drawImage();
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      changeImage(-1);
      break;
    case 'ArrowRight':
      changeImage(1);
      break;
    case 'ArrowUp':
      changeZoom(1.1);
      break;
    case 'ArrowDown':
      changeZoom(0.9);
      break;
  }
});

loadImages(drawImage);
