const defaultImages = [
  'https://i.ibb.co/MybXCVBR/Los-Angeles-Heavyweight-Crewneck-Sweatshirt-Front.png',
  'https://i.ibb.co/KzBQvgW9/Max-Heavyweight-Garment-Dye-T-Shirt-Front.png'
];

const canvas = document.getElementById('canvas');
const layerList = document.getElementById('layerList');
const textInput = document.getElementById('textInput');
const layers = [];
let currentImageIndex = 0;
let scale = 1;

function updateLayerPanel() {
  layerList.innerHTML = '';
  layers.forEach(layer => {
    const li = document.createElement('li');
    if (layer.type === 'image') {
      li.textContent = layer.name;
      if (layer.visible) li.classList.add('active');
    } else {
      li.textContent = `Texto: ${layer.element.textContent}`;
    }
    layerList.appendChild(li);
  });
}

function addImageLayer(src, name) {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('layer-image');
  img.style.display = 'none';
  canvas.appendChild(img);
  const layer = { type: 'image', element: img, name, visible: false };
  layers.push(layer);
  updateLayerPanel();
  return layer;
}

function showImage(index) {
  const imageLayers = layers.filter(l => l.type === 'image');
  imageLayers.forEach((layer, i) => {
    layer.visible = i === index;
    layer.element.style.display = layer.visible ? 'block' : 'none';
    layer.element.style.transform = `scale(${scale})`;
  });
  currentImageIndex = index;
  updateLayerPanel();
}

defaultImages.forEach((src, i) => addImageLayer(src, `Imagen ${i + 1}`));
if (layers.filter(l => l.type === 'image').length > 0) {
  showImage(0);
}

document.getElementById('prev').addEventListener('click', () => {
  const imgs = layers.filter(l => l.type === 'image');
  if (!imgs.length) return;
  currentImageIndex = (currentImageIndex - 1 + imgs.length) % imgs.length;
  showImage(currentImageIndex);
});

document.getElementById('next').addEventListener('click', () => {
  const imgs = layers.filter(l => l.type === 'image');
  if (!imgs.length) return;
  currentImageIndex = (currentImageIndex + 1) % imgs.length;
  showImage(currentImageIndex);
});

document.getElementById('zoomIn').addEventListener('click', () => {
  scale += 0.1;
  const imgs = layers.filter(l => l.type === 'image');
  imgs.forEach(layer => {
    layer.element.style.transform = `scale(${scale})`;
  });
});

document.getElementById('zoomOut').addEventListener('click', () => {
  scale = Math.max(0.1, scale - 0.1);
  const imgs = layers.filter(l => l.type === 'image');
  imgs.forEach(layer => {
    layer.element.style.transform = `scale(${scale})`;
  });
});

document.getElementById('upload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    const layer = addImageLayer(evt.target.result, `Imagen ${layers.length + 1}`);
    const imgs = layers.filter(l => l.type === 'image');
    showImage(imgs.indexOf(layer));
  };
  reader.readAsDataURL(file);
});

document.getElementById('addText').addEventListener('click', () => {
  const value = textInput.value.trim();
  if (!value) return;
  const div = document.createElement('div');
  div.textContent = value;
  div.classList.add('text-layer');
  canvas.appendChild(div);
  layers.push({ type: 'text', element: div });
  textInput.value = '';
  updateLayerPanel();
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    document.getElementById('prev').click();
  } else if (e.key === 'ArrowRight') {
    document.getElementById('next').click();
  }
});
