# Simple Canvas App

This project provides a minimal responsive web app with a fixed 700x700 canvas. Users can switch between preset images using arrow buttons or the keyboard and zoom the image without changing the canvas size. The toolbar lets you upload custom images and add multiple text layers over the canvas. A panel on the right lists only the layers you add, starting empty when the page loads. You can click any layer to select it and drag layers up or down in the list to change their order on the canvas.

The layout adapts to any screen size. On screens wider than about 900&nbsp;px the layer panel sits beside the canvas, while on smaller displays it moves below and the controls shrink so the app remains fully usable on phones and tablets. The entire interface is centered on the page so it looks balanced on both desktop and mobile.

## Files
- `index.html` – main HTML page
- `styles.css` – styles for responsive design
- `script.js` – handles images, text layers, zoom and layer management

## Usage
Open `index.html` in a web browser. The layout adjusts for mobile and desktop screens. Use the arrow buttons or left/right arrow keys to change images. Use the plus and minus buttons to zoom in or out. The layer panel lists each layer and highlights the active image. When you first open the page the panel is empty, and it will display items only after you upload an image or add text.
You can reorder visible layers by dragging them in the list.
