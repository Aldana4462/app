const images = [
  'https://i.ibb.co/MybXCVBR/Los-Angeles-Heavyweight-Crewneck-Sweatshirt-Front.png',
  'https://i.ibb.co/KzBQvgW9/Max-Heavyweight-Garment-Dye-T-Shirt-Front.png'
];

let currentIndex = 0;
let scale = 1;
const img = document.getElementById('image');

function updateImage() {
  img.src = images[currentIndex];
}

document.getElementById('prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
});

document.getElementById('next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
});

document.getElementById('zoomIn').addEventListener('click', () => {
  scale += 0.1;
  img.style.transform = `scale(${scale})`;
});

document.getElementById('zoomOut').addEventListener('click', () => {
  scale = Math.max(0.1, scale - 0.1);
  img.style.transform = `scale(${scale})`;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  } else if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }
});
