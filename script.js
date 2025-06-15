const defaultImages = [
  'https://i.ibb.co/MybXCVBR/Los-Angeles-Heavyweight-Crewneck-Sweatshirt-Front.png',
  'https://i.ibb.co/KzBQvgW9/Max-Heavyweight-Garment-Dye-T-Shirt-Front.png'
];

const canvas = document.getElementById('canvas');
const layerList = document.getElementById('layerList');
const textInput = document.getElementById('textInput');
const propScale = document.getElementById('propScale');
const propX = document.getElementById('propX');
const propY = document.getElementById('propY');
const propRotate = document.getElementById('propRotate');
const propOpacity = document.getElementById('propOpacity');
const cropTop = document.getElementById('cropTop');
const cropRight = document.getElementById('cropRight');
const cropBottom = document.getElementById('cropBottom');
const cropLeft = document.getElementById('cropLeft');
const layers = [];
let customImageCount = 0;
let customTextCount = 0;
let currentImageIndex = 0;
let currentBackgroundIndex = 0;
let selectedLayer = null;
let dragStartIndex = null;

function getDefaultLayers() {
  return layers.filter(l => l.type === 'image' && l.isDefault);
}

function showBackground(index) {
  const defaults = getDefaultLayers();
  defaults.forEach((layer, i) => {
    const visible = i === index;
    layer.element.style.display = visible ? 'block' : 'none';
    layer.visible = visible;
  });
  currentBackgroundIndex = index;
}

function applyLayerStyles(layer) {
  const parts = [];
  if (layer.type === 'image' && !layer.isDefault) {
    parts.push('translate(-50%, -50%)');
  }
  parts.push(`translate(${layer.x}px, ${layer.y}px)`);
  parts.push(`scale(${layer.scale})`);
  parts.push(`rotate(${layer.rotation}deg)`);
  layer.element.style.transform = parts.join(' ');
  layer.element.style.opacity = layer.opacity;
  const c = layer.crop;
  layer.element.style.clipPath = `inset(${c.top}% ${c.right}% ${c.bottom}% ${c.left}%)`;
}

function updateLayerPanel() {
  layerList.innerHTML = '';
  layers.forEach(layer => {
    if (layer.isDefault) return;
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = layers.indexOf(layer);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('layer-name');
    nameSpan.textContent = layer.name;
    li.appendChild(nameSpan);

    const controls = document.createElement('div');
    controls.classList.add('layer-controls');

    const visBtn = document.createElement('button');
    visBtn.textContent = layer.visible ? '👁' : '🚫';
    visBtn.addEventListener('click', e => {
      e.stopPropagation();
      layer.visible = !layer.visible;
      layer.element.style.display = layer.visible ? 'block' : 'none';
      updateLayerPanel();
    });
    controls.appendChild(visBtn);

    const renameBtn = document.createElement('button');
    renameBtn.textContent = '✏️';
    renameBtn.addEventListener('click', e => {
      e.stopPropagation();
      const newName = prompt('Nuevo nombre', layer.name);
      if (newName) {
        layer.name = newName;
        if (layer.type === 'text') {
          layer.element.textContent = newName;
        }
        updateLayerPanel();
      }
    });
    controls.appendChild(renameBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = layers.indexOf(layer);
      if (idx > -1) {
        layers.splice(idx, 1);
        layer.element.remove();
        if (selectedLayer === layer) selectedLayer = null;
        updateCanvasOrder();
        updateLayerPanel();
      }
    });
    controls.appendChild(delBtn);

    li.appendChild(controls);
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

  updatePropertyPanel();
}

function updateCanvasOrder() {
  layers.forEach((layer, idx) => {
    layer.element.style.zIndex = idx;
    canvas.appendChild(layer.element);
  });
}

function updatePropertyPanel() {
  const inputs = [propScale, propX, propY, propRotate, propOpacity, cropTop, cropRight, cropBottom, cropLeft];
  if (!selectedLayer) {
    inputs.forEach(i => { i.disabled = true; });
    return;
  }
  inputs.forEach(i => { i.disabled = false; });
  propScale.value = selectedLayer.scale;
  propX.value = selectedLayer.x;
  propY.value = selectedLayer.y;
  propRotate.value = selectedLayer.rotation;
  propOpacity.value = selectedLayer.opacity;
  cropTop.value = selectedLayer.crop.top;
  cropRight.value = selectedLayer.crop.right;
  cropBottom.value = selectedLayer.crop.bottom;
  cropLeft.value = selectedLayer.crop.left;
}

function addImageLayer(src, name, isDefault = false) {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('layer-image');
  if (!isDefault) {
    img.classList.add('custom-image');
  }
  img.style.display = isDefault ? 'none' : 'block';
  canvas.appendChild(img);
  const layer = { type: 'image', element: img, name, isDefault, scale: 1, x: 0, y: 0, rotation: 0, crop: {top:0,right:0,bottom:0,left:0}, opacity: 1, visible: true };
  layers.push(layer);
  applyLayerStyles(layer);
  updateCanvasOrder();
  updateLayerPanel();
  return layer;
}


defaultImages.forEach((src, i) => addImageLayer(src, `Imagen ${i + 1}`, true));
const imageLayers = layers.filter(l => l.type === 'image');
if (imageLayers.length > 0) {
  selectedLayer = imageLayers[0];
  if (selectedLayer.isDefault) {
    showBackground(0);
  }
}

document.getElementById('prev').addEventListener('click', () => {
  const imgs = layers.filter(l => l.type === 'image');
  if (!imgs.length) return;
  currentImageIndex = (currentImageIndex - 1 + imgs.length) % imgs.length;
  selectedLayer = imgs[currentImageIndex];
  if (selectedLayer.isDefault) {
    const idx = getDefaultLayers().indexOf(selectedLayer);
    showBackground(idx);
  }
  updateLayerPanel();
});

document.getElementById('next').addEventListener('click', () => {
  const imgs = layers.filter(l => l.type === 'image');
  if (!imgs.length) return;
  currentImageIndex = (currentImageIndex + 1) % imgs.length;
  selectedLayer = imgs[currentImageIndex];
  if (selectedLayer.isDefault) {
    const idx = getDefaultLayers().indexOf(selectedLayer);
    showBackground(idx);
  }
  updateLayerPanel();
});

document.getElementById('zoomIn').addEventListener('click', () => {
  if (!selectedLayer || selectedLayer.type !== 'image') return;
  selectedLayer.scale += 0.1;
  applyLayerStyles(selectedLayer);
});

document.getElementById('zoomOut').addEventListener('click', () => {
  if (!selectedLayer || selectedLayer.type !== 'image') return;
  selectedLayer.scale = Math.max(0.1, selectedLayer.scale - 0.1);
  applyLayerStyles(selectedLayer);
});

document.getElementById('upload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    customImageCount++;
    const layer = addImageLayer(evt.target.result, `Imagen ${customImageCount}`);
    const imgs = layers.filter(l => l.type === 'image');
    currentImageIndex = imgs.indexOf(layer);
    selectedLayer = layer;
    updateLayerPanel();
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
  customTextCount++;
  layers.push({ type: 'text', element: div, name: `Texto ${customTextCount}`, scale: 1, x: 0, y: 0, rotation: 0, crop: {top:0,right:0,bottom:0,left:0}, opacity: 1, visible: true });
  applyLayerStyles(layers[layers.length - 1]);
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

[propScale, propX, propY, propRotate, propOpacity, cropTop, cropRight, cropBottom, cropLeft].forEach(input => {
  input.addEventListener('input', () => {
    if (!selectedLayer) return;
    selectedLayer.scale = parseFloat(propScale.value);
    selectedLayer.x = parseFloat(propX.value);
    selectedLayer.y = parseFloat(propY.value);
    selectedLayer.rotation = parseFloat(propRotate.value);
    selectedLayer.opacity = parseFloat(propOpacity.value);
    selectedLayer.crop = {
      top: parseFloat(cropTop.value),
      right: parseFloat(cropRight.value),
      bottom: parseFloat(cropBottom.value),
      left: parseFloat(cropLeft.value)
    };
    applyLayerStyles(selectedLayer);
  });
});
