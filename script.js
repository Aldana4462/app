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
const cropToggle = document.getElementById('cropToggle');
const cropGroupDiv = document.getElementById('cropGroup');
const textColor = document.getElementById('textColor');
const textFont = document.getElementById('textFont');
const textBold = document.getElementById('textBold');
const textUpper = document.getElementById('textUpper');
const textStrike = document.getElementById('textStrike');
const textUnderline = document.getElementById('textUnderline');
const layers = [];
let customImageCount = 0;
let customTextCount = 0;
let currentImageIndex = 0;
let currentBackgroundIndex = 0;
let selectedLayer = null;
let selectedLayers = [];
let dragStartIndex = null;
const actionInfo = document.getElementById('actionInfo');

function showActionInfo(text) {
  if (!actionInfo) return;
  actionInfo.textContent = text;
  actionInfo.classList.add('show');
  clearTimeout(showActionInfo._id);
  showActionInfo._id = setTimeout(() => actionInfo.classList.remove('show'), 1000);
}

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
  if (layer.type === 'text') {
    layer.element.style.color = layer.color;
    layer.element.style.fontFamily = `'${layer.font}', sans-serif`;
    layer.element.style.fontWeight = layer.bold ? 'bold' : 'normal';
    layer.element.style.textTransform = layer.upper ? 'uppercase' : 'none';
    const decorations = [];
    if (layer.underline) decorations.push('underline');
    if (layer.strike) decorations.push('line-through');
    layer.element.style.textDecoration = decorations.join(' ');
  }
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
        selectedLayers = selectedLayers.filter(l => l !== layer);
        updateCanvasOrder();
        updateLayerPanel();
      }
    });
    controls.appendChild(delBtn);

    li.appendChild(controls);
    if (selectedLayers.includes(layer)) li.classList.add('selected');
    li.addEventListener('click', e => {
      const append = e.ctrlKey || e.metaKey;
      if (!append) {
        selectedLayers = [layer];
      } else {
        if (selectedLayers.includes(layer)) {
          selectedLayers = selectedLayers.filter(l => l !== layer);
        } else {
          selectedLayers.push(layer);
        }
      }
      selectedLayer = selectedLayers[selectedLayers.length - 1] || null;
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
  const textInputs = [textColor, textFont, textBold, textUpper, textStrike, textUnderline];
  if (selectedLayers.length !== 1) {
    inputs.concat(textInputs).forEach(i => { i.disabled = true; });
    return;
  }
  selectedLayer = selectedLayers[0];
  inputs.forEach(i => { i.disabled = false; });
  const isText = selectedLayer.type === 'text';
  textInputs.forEach(i => { i.disabled = !isText; });
  propScale.value = selectedLayer.scale;
  propX.value = selectedLayer.x;
  propY.value = selectedLayer.y;
  propRotate.value = selectedLayer.rotation;
  propOpacity.value = selectedLayer.opacity;
  cropTop.value = selectedLayer.crop.top;
  cropRight.value = selectedLayer.crop.right;
  cropBottom.value = selectedLayer.crop.bottom;
  cropLeft.value = selectedLayer.crop.left;
  if (isText) {
    textColor.value = selectedLayer.color;
    textFont.value = selectedLayer.font;
    textBold.checked = selectedLayer.bold;
    textUpper.checked = selectedLayer.upper;
    textStrike.checked = selectedLayer.strike;
    textUnderline.checked = selectedLayer.underline;
  }
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
  selectedLayers = [selectedLayer];
  if (selectedLayer.isDefault) {
    showBackground(0);
  }
}

document.getElementById('prev').addEventListener('click', () => {
  const imgs = layers.filter(l => l.type === 'image');
  if (!imgs.length) return;
  currentImageIndex = (currentImageIndex - 1 + imgs.length) % imgs.length;
  selectedLayer = imgs[currentImageIndex];
  selectedLayers = [selectedLayer];
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
  selectedLayers = [selectedLayer];
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
    selectedLayers = [layer];
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
  layers.push({ type: 'text', element: div, name: `Texto ${customTextCount}`, scale: 1, x: 0, y: 0, rotation: 0, crop: {top:0,right:0,bottom:0,left:0}, opacity: 1, visible: true, color: '#000000', font: 'Roboto', bold: false, upper: false, strike: false, underline: false });
  applyLayerStyles(layers[layers.length - 1]);
  updateCanvasOrder();
  textInput.value = '';
  selectedLayers = [layers[layers.length - 1]];
  selectedLayer = layers[layers.length - 1];
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

[textColor, textFont, textBold, textUpper, textStrike, textUnderline].forEach(input => {
  input.addEventListener('input', () => {
    if (!selectedLayer || selectedLayer.type !== 'text') return;
    selectedLayer.color = textColor.value;
    selectedLayer.font = textFont.value;
    selectedLayer.bold = textBold.checked;
    selectedLayer.upper = textUpper.checked;
    selectedLayer.strike = textStrike.checked;
    selectedLayer.underline = textUnderline.checked;
    applyLayerStyles(selectedLayer);
  });
});

function alignSelected(dir) {
  if (selectedLayers.length === 0) return;
  const canvasRect = canvas.getBoundingClientRect();
  const rects = selectedLayers.map(l => l.element.getBoundingClientRect());

  if (selectedLayers.length === 1) {
    const layer = selectedLayers[0];
    const rect = rects[0];
    let dx = 0;
    let dy = 0;
    switch (dir) {
      case 'left':
        dx = canvasRect.left - rect.left;
        break;
      case 'right':
        dx = canvasRect.right - rect.right;
        break;
      case 'hcenter':
        dx = (canvasRect.left + canvasRect.width / 2) - (rect.left + rect.width / 2);
        break;
      case 'top':
        dy = canvasRect.top - rect.top;
        break;
      case 'bottom':
        dy = canvasRect.bottom - rect.bottom;
        break;
      case 'vcenter':
        dy = (canvasRect.top + canvasRect.height / 2) - (rect.top + rect.height / 2);
        break;
    }
    layer.x += dx;
    layer.y += dy;
    applyLayerStyles(layer);
    updatePropertyPanel();
    return;
  }

  switch (dir) {
    case 'left': {
      const target = Math.min(...rects.map(r => r.left));
      selectedLayers.forEach((layer, i) => {
        layer.x += target - rects[i].left;
        applyLayerStyles(layer);
      });
      break;
    }
    case 'right': {
      const target = Math.max(...rects.map(r => r.right));
      selectedLayers.forEach((layer, i) => {
        layer.x += target - rects[i].right;
        applyLayerStyles(layer);
      });
      break;
    }
    case 'hcenter': {
      const centers = rects.map(r => r.left + r.width / 2);
      const target = (Math.min(...centers) + Math.max(...centers)) / 2;
      selectedLayers.forEach((layer, i) => {
        layer.x += target - centers[i];
        applyLayerStyles(layer);
      });
      break;
    }
    case 'top': {
      const target = Math.min(...rects.map(r => r.top));
      selectedLayers.forEach((layer, i) => {
        layer.y += target - rects[i].top;
        applyLayerStyles(layer);
      });
      break;
    }
    case 'bottom': {
      const target = Math.max(...rects.map(r => r.bottom));
      selectedLayers.forEach((layer, i) => {
        layer.y += target - rects[i].bottom;
        applyLayerStyles(layer);
      });
      break;
    }
    case 'vcenter': {
      const centers = rects.map(r => r.top + r.height / 2);
      const target = (Math.min(...centers) + Math.max(...centers)) / 2;
      selectedLayers.forEach((layer, i) => {
        layer.y += target - centers[i];
        applyLayerStyles(layer);
      });
      break;
    }
  }
  updatePropertyPanel();
}

function distributeSelected(axis) {
  if (selectedLayers.length < 3) return;
  const rects = selectedLayers.map(l => l.element.getBoundingClientRect());
  if (axis === 'h') {
    const centers = rects.map(r => r.left + r.width / 2);
    const sorted = centers.map((c, i) => ({c, i})).sort((a,b)=>a.c-b.c);
    const min = centers[sorted[0].i];
    const max = centers[sorted[sorted.length-1].i];
    const step = (max - min) / (selectedLayers.length - 1);
    sorted.forEach((obj, idx) => {
      const target = min + idx * step;
      const layer = selectedLayers[obj.i];
      const rect = rects[obj.i];
      const center = rect.left + rect.width/2;
      layer.x += target - center;
      applyLayerStyles(layer);
    });
  } else if (axis === 'v') {
    const centers = rects.map(r => r.top + r.height / 2);
    const sorted = centers.map((c, i) => ({c, i})).sort((a,b)=>a.c-b.c);
    const min = centers[sorted[0].i];
    const max = centers[sorted[sorted.length-1].i];
    const step = (max - min) / (selectedLayers.length - 1);
    sorted.forEach((obj, idx) => {
      const target = min + idx * step;
      const layer = selectedLayers[obj.i];
      const rect = rects[obj.i];
      const center = rect.top + rect.height/2;
      layer.y += target - center;
      applyLayerStyles(layer);
    });
  }
  updatePropertyPanel();
}

['alignLeft','alignHCenter','alignRight','alignTop','alignVCenter','alignBottom','distH','distV','prev','next','zoomIn','zoomOut'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', e => {
    const action = e.currentTarget.dataset.action || '';
    if (action) showActionInfo(action);
  });
});

document.getElementById('alignLeft').addEventListener('click', () => alignSelected('left'));
document.getElementById('alignHCenter').addEventListener('click', () => alignSelected('hcenter'));
document.getElementById('alignRight').addEventListener('click', () => alignSelected('right'));
document.getElementById('alignTop').addEventListener('click', () => alignSelected('top'));
document.getElementById('alignVCenter').addEventListener('click', () => alignSelected('vcenter'));
document.getElementById('alignBottom').addEventListener('click', () => alignSelected('bottom'));
document.getElementById('distH').addEventListener('click', () => distributeSelected('h'));
document.getElementById('distV').addEventListener('click', () => distributeSelected('v'));

cropToggle.addEventListener('click', () => {
  cropGroupDiv.classList.toggle('hidden');
});
