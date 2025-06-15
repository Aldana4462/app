const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

const imageUrls = [
  'https://i.ibb.co/MybXCVBR/Los-Angeles-Heavyweight-Crewneck-Sweatshirt-Front.png',
  'https://i.ibb.co/KzBQvgW9/Max-Heavyweight-Garment-Dye-T-Shirt-Front.png'
];

const images = [];
let currentIndex = 0;
let zoom = 1;
const layers = [];

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

function drawCanvas() {
  const img = images[currentIndex];
  if (!img) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scaledWidth = img.width * zoom;
  const scaledHeight = img.height * zoom;
  const x = (canvas.width - scaledWidth) / 2;
  const y = (canvas.height - scaledHeight) / 2;
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  layers.forEach(layer => {
    if (layer.type === 'image') {
      ctx.drawImage(layer.img, layer.x, layer.y);
    } else if (layer.type === 'text') {
      ctx.font = '20px sans-serif';
      ctx.fillStyle = 'black';
      ctx.fillText(layer.text, layer.x, layer.y);
    }
  });
}

function changeImage(delta) {
  currentIndex = (currentIndex + delta + images.length) % images.length;
  drawCanvas();
}

function changeZoom(factor) {
  zoom = Math.min(Math.max(0.5, zoom * factor), 5);
  drawCanvas();
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

document.getElementById('prevButton').addEventListener('click', () => changeImage(-1));
document.getElementById('nextButton').addEventListener('click', () => changeImage(1));

const imageUpload = document.getElementById('imageUpload');
const textInput = document.getElementById('textInput');
const addTextButton = document.getElementById('addTextButton');
const layersList = document.getElementById('layersList');

function updateLayersPanel() {
  layersList.innerHTML = '';
  layers.forEach((layer, idx) => {
    const li = document.createElement('li');
    li.textContent = layer.type === 'image' ? `Image ${idx + 1}` : `Text: ${layer.text}`;
    layersList.appendChild(li);
  });
}

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      layers.push({ type: 'image', img, x: 10, y: 30 });
      updateLayersPanel();
      drawCanvas();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  imageUpload.value = '';
});

addTextButton.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) return;
  layers.push({ type: 'text', text, x: 10, y: 60 + layers.length * 20 });
  textInput.value = '';
  updateLayersPanel();
  drawCanvas();
});

loadImages(drawCanvas);
