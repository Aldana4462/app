const defaultImages = [
  'https://i.ibb.co/MybXCVBR/Los-Angeles-Heavyweight-Crewneck-Sweatshirt-Front.png',
  'https://i.ibb.co/KzBQvgW9/Max-Heavyweight-Garment-Dye-T-Shirt-Front.png'
];

const canvas = document.getElementById('canvas');
const layerList = document.getElementById('layerList');
const textInput = document.getElementById('textInput');
const layers = [];
let customImageCount = 0;
let currentImageIndex = 0;
let scale = 1;
let selectedLayer = null;
let dragStartIndex = null;

function updateLayerPanel() {
  layerList.innerHTML = '';
  layers.forEach(layer => {
    if (layer.isDefault) return;
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = layers.indexOf(layer);
    if (layer.type === 'image') {
      li.textContent = layer.name;
      if (layer.visible) li.classList.add('active');
    } else {
      li.textContent = `Texto: ${layer.element.textContent}`;
    }
    if (layer === selectedLayer) li.classList.add('selected');
    li.addEventListener('click', () => {
      selectedLayer = layer;
      updateLayerPanel();
    });
    li.addEventListener('dragstart', e => {
      dragStartIndex = parseInt(e.target.dataset.index, 10);
      e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragover', e => e.preventDefault());
    li.addEventListener('drop', e => {
      e.preventDefault();
      const dropIndex = parseInt(e.target.dataset.index, 10);
      if (dragStartIndex === null || dragStartIndex === dropIndex) return;
      const moved = layers.splice(dragStartIndex, 1)[0];
      layers.splice(dropIndex, 0, moved);
      dragStartIndex = null;
      updateCanvasOrder();
      updateLayerPanel();
    });
    layerList.appendChild(li);
  });
}

function updateCanvasOrder() {
  layers.forEach((layer, idx) => {
    layer.element.style.zIndex = idx;
    canvas.appendChild(layer.element);
  });
}

function addImageLayer(src, name, isDefault = false) {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('layer-image');
  img.style.display = 'none';
  canvas.appendChild(img);
  const layer = { type: 'image', element: img, name, visible: false, isDefault };
  layers.push(layer);
  updateCanvasOrder();
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
  updateCanvasOrder();
  updateLayerPanel();
}

defaultImages.forEach((src, i) => addImageLayer(src, `Imagen ${i + 1}`, true));
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
    customImageCount++;
    const layer = addImageLayer(evt.target.result, `Imagen ${customImageCount}`);
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
  updateCanvasOrder();
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
